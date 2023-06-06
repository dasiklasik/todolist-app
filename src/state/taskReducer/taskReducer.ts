import {
    addTodolist, clearData, removeTodolist, setTodolists
} from "../todolistReducer/todolistReducer";
import {tasksApi, TaskType, UpdateTaskType} from "../../api/API";
import {RequestStatusType} from "../appReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

//thunks
export const fetchTasksThunk = createAsyncThunk('tasks/fetchTasks',
    async (todolistId: string, {rejectWithValue}) => {
        try {
            const response = await tasksApi.fetchTasks(todolistId)
            return {todolistId, taskData: response.items}
        } catch (err) {
            const error: AxiosError = err as any
            return rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })

export const addTaskThunk = createAsyncThunk('tasks/addTask',
    async (param: { todolistId: string, title: string }, {rejectWithValue}) => {
        const {todolistId, title} = param
        try {
            const response = await tasksApi.addTask(todolistId, title)
            if (response.resultCode === 0) {
                return response
            } else {
                return rejectWithValue({error: response.messages[0], fieldsErrors: response.fieldsErrors})
            }
        } catch (err) {
            const error: AxiosError = err as any
            return rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })

export const removeTaskThunk = createAsyncThunk('tasks/removeTask',
    async (param: { todolistId: string, taskId: string }, {dispatch, rejectWithValue}) => {
        const {todolistId, taskId} = param
        dispatch(setTaskEntityStatus({todolistId, taskId, status: 'loading'}))
        try {
            const response = await tasksApi.deleteTask(todolistId, taskId)
            if (response.resultCode === 0) {
                return response
            } else {
                return rejectWithValue({error: response.messages[0], fieldsErrors: response.fieldsErrors})
            }

        } catch (err) {
            dispatch(setTaskEntityStatus({todolistId, taskId, status: 'failed'}))
            const error: AxiosError = err as any
            return rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })


export const updateTaskThunk = createAsyncThunk('tasks/updateTask',
    async (params: { todolistId: string, taskId: string, taskData: UpdateTaskType}, {dispatch, rejectWithValue}) => {
        const {todolistId, taskId, taskData} = params
        dispatch(setTaskEntityStatus({todolistId, taskId, status: 'loading'}))
        try {
            const response = await tasksApi.updateTask(todolistId, taskId, taskData)
            if (response.resultCode === 0) {
                return response
            } else {
                dispatch(setTaskEntityStatus({todolistId, taskId, status: 'failed'}))
                return rejectWithValue({error: response.messages[0], fieldsErrors: response.fieldsErrors})
            }
        } catch (err) {
            dispatch(setTaskEntityStatus({todolistId, taskId, status: 'failed'}))
            const error: AxiosError = err as any
            return rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })

const slice = createSlice({
    name: 'tasks',
    initialState: {} as StateType,
    reducers: {
        setTaskEntityStatus: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                state[action.payload.todolistId][index] = {
                    ...state[action.payload.todolistId][index],
                    entityStatus: action.payload.status
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodolist, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(removeTodolist, (state, action) => {
                delete state[action.payload]
            })
            .addCase(setTodolists, (state, action) => {
                action.payload.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(clearData, () => {
                return {}
            })
            .addCase(fetchTasksThunk.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.taskData.map(task => ({
                    ...task,
                    entityStatus: 'idle',
                }))
            })
            .addCase(addTaskThunk.fulfilled, (state, action) => {
                if (action.payload.resultCode === 0) {
                    state[action.payload.data.item.todoListId].unshift({
                        ...action.payload.data.item,
                        entityStatus: 'idle',
                    })
                }
            })
            .addCase(removeTaskThunk.fulfilled, (state, action) => {
                const index = state[action.meta.arg.todolistId].findIndex(t => t.id === action.meta.arg.taskId)
                if (index !== -1) {
                    state[action.meta.arg.todolistId][index].entityStatus = 'succeeded'
                    state[action.meta.arg.todolistId].splice(index, 1)
                }
            })
            .addCase(updateTaskThunk.fulfilled, (state, action) => {
                if (action.payload.resultCode === 0) {
                    const index = state[action.meta.arg.todolistId].findIndex(t => t.id === action.meta.arg.taskId)
                    if (index !== -1) {
                        state[action.meta.arg.todolistId][index].entityStatus = 'succeeded'
                        state[action.meta.arg.todolistId][index] = {...action.payload.data.item, entityStatus: 'idle'}
                    }
                }
            })
    }
})

export const taskReducer = slice.reducer

//actions
export const {setTaskEntityStatus} = slice.actions

//types
export type AppTaskType = TaskType & { entityStatus: RequestStatusType }

type StateType = {
    [key: string]: Array<AppTaskType>
}