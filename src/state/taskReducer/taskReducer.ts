import {
    addTodolist, clearData, removeTodolist, setTodolists
} from "../todolistReducer/todolistReducer";
import {tasksApi, TaskType, UpdateTaskType} from "../../api/API";
import {handleServerAppError} from "../../utils/erorr-utils";
import {RequestStatusType} from "../appReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

let initialState: StateType = {}

//thunks
export const fetchTasksThunk = createAsyncThunk('tasks/fetchTasks',
    async (todolistId: string, thunkAPI) => {
        const response = await tasksApi.fetchTasks(todolistId)
        return {todolistId, taskData: response.data.items}
    })

export const addTaskThunk = createAsyncThunk('tasks/addTask',
    async (param: { todolistId: string, title: string }, thunkAPI) => {
        const {todolistId, title} = param
        try {
            const response = await tasksApi.addTask(todolistId, title)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    })

export const removeTaskThunk = createAsyncThunk('tasks/removeTask',
    async (param: { todolistId: string, taskId: string }, thunkAPI) => {
        const {todolistId, taskId} = param
        thunkAPI.dispatch(setTaskEntityStatus({todolistId, taskId, status: 'loading'}))
        const response = await tasksApi.deleteTask(todolistId, taskId)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setTaskEntityStatus({todolistId, taskId, status: 'succeeded'}))
        } else {
            thunkAPI.dispatch(setTaskEntityStatus({todolistId, taskId, status: 'failed'}))
            handleServerAppError(response.data, thunkAPI.dispatch)
        }
        return response.data
    })


export const updateTaskThunk = createAsyncThunk('tasks/updateTask',
    async (params: { todolistId: string, taskId: string, taskData: UpdateTaskType }, thunkAPI) => {
        const {
            todolistId, taskId, taskData
        } = params
        thunkAPI.dispatch(setTaskEntityStatus({todolistId, taskId, status: 'loading'}))
        const response = await tasksApi.updateTask(todolistId, taskId, taskData)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setTaskEntityStatus({todolistId, taskId, status: 'succeeded'}))
        } else {
            thunkAPI.dispatch(setTaskEntityStatus({todolistId, taskId, status: 'failed'}))
            handleServerAppError(response.data, thunkAPI.dispatch)
        }
        return response.data
    })

const slice = createSlice({
    name: 'tasks',
    initialState,
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
                debugger
                if (action.payload.resultCode === 0) {
                    state[action.payload.data.item.todoListId].unshift({
                        ...action.payload.data.item,
                        entityStatus: 'idle',
                    })
                }
            })
            .addCase(removeTaskThunk.fulfilled, (state, action) => {
                if (action.payload.resultCode === 0) {
                    const index = state[action.meta.arg.todolistId].findIndex(t => t.id === action.meta.arg.taskId)
                    if (index !== -1) {
                        state[action.meta.arg.todolistId].splice(index, 1)
                    }
                }
            })
            .addCase(updateTaskThunk.fulfilled, (state, action) => {
                if (action.payload.resultCode === 0) {
                    const index = state[action.meta.arg.todolistId].findIndex(t => t.id === action.meta.arg.taskId)
                    if (index !== -1) {
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