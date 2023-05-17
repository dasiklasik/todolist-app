import {
    addTodolist, clearData, removeTodolist, setTodolists,
    setTodolistStatus
} from "../todolistReducer";
import {AnyAction} from "redux";
import {tasksApi, TaskType, UpdateTaskType} from "../../api/API";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "../store";
import {handleServerAppError, handleServerNetworkError} from "../../utils/erorr-utils";
import {RequestStatusType} from "../appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

let initialState: StateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        },
        addTask: (state, action: PayloadAction<{ todolistId: string, taskData: TaskType }>) => {
            state[action.payload.todolistId].unshift({
                ...action.payload.taskData,
                entityStatus: 'idle'
            })
        },
        setTasks: (state, action: PayloadAction<{ todolistId: string, taskData: TaskType[] }>) => {
            state[action.payload.todolistId] = action.payload.taskData.map(task => ({...task, entityStatus: 'idle'}))
        },
        changeTask: (state, action: PayloadAction<{ todolistId: string, taskData: TaskType }>) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskData.id)
            if (index !== -1) {
                state[action.payload.todolistId][index] = {...action.payload.taskData, entityStatus: 'idle'}
            }
        },
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
    }
})

export const taskReducer = slice.reducer

//actions
export const {setTaskEntityStatus, setTasks, changeTask, removeTask, addTask} = slice.actions

//thunks
export const fetchTasksThunk = (todolistId: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    tasksApi.fetchTasks(todolistId)
        .then(response => {
            dispatch(setTasks({todolistId, taskData: response.items}))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

export const addTaskThunk = (todolistId: string, title: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setTodolistStatus({todolistId, status: 'loading'}))
    tasksApi.addTask(todolistId, title)
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(addTask({todolistId, taskData: response.data.item}))
                dispatch(setTodolistStatus({todolistId, status: 'succeeded'}))
            } else {
                handleServerAppError(response, dispatch)
                dispatch(setTodolistStatus({todolistId, status: 'failed'}))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(setTodolistStatus({todolistId, status: 'failed'}))
        })
}

export const removeTaskThunk = (todolistId: string, taskId: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setTaskEntityStatus({todolistId, taskId, status: 'loading'}))
    tasksApi.deleteTask(todolistId, taskId)
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(removeTask({todolistId, taskId}))
                dispatch(setTaskEntityStatus({todolistId, taskId, status: 'succeeded'}))
            } else {
                handleServerAppError(response, dispatch)
                dispatch(setTaskEntityStatus({todolistId, taskId, status: 'failed'}))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(setTaskEntityStatus({todolistId, taskId, status: 'failed'}))
        })
}

export const updateTaskThunk = (todolistId: string, taskId: string, taskData: UpdateTaskType) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setTaskEntityStatus({todolistId, taskId, status: 'loading'}))
    tasksApi.updateTask(todolistId, taskId, taskData)
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(changeTask({todolistId, taskData: response.data.item}))
                dispatch(setTaskEntityStatus({todolistId, taskId, status: 'succeeded'}))
            } else {
                handleServerAppError(response, dispatch)
                dispatch(setTaskEntityStatus({todolistId, taskId, status: 'failed'}))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(setTaskEntityStatus({todolistId, taskId, status: 'failed'}))
        })
}


//types
export type AppTaskType = TaskType & { entityStatus: RequestStatusType }

type StateType = {
    [key: string]: Array<AppTaskType>
}