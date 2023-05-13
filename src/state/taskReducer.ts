import {
    AddTodolistType, ClearDataType,
    RemoveTodolistType,
    setTodolistStatus,
    SetTodolistsType
} from "./todolistReducer";
import {AnyAction} from "redux";
import {tasksApi, TaskType, UpdateTaskType} from "../api/API";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {handleServerAppError, handleServerNetworkError} from "../utils/erorr-utils";
import {RequestStatusType} from "./appReducer";

let initialState: StateType = {}

export const taskReducer = (state = initialState, action: ActionType): StateType => {
    switch (action.type) {
        case "SET-TODOLISTS":
            const stateCopy = {...state}
            action.todolistData.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.taskData.map(task => ({...task, entityStatus: 'idle'}))}
        case "REMOVE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "REMOVE-TODOLIST":
            delete state[action.todolistId]
            return state
        case "ADD-TASK":
            return {...state, [action.todolistId]: [{...action.taskData, entityStatus: 'idle'}, ...state[action.todolistId]]}
        case "CHANGE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(i => i.id === action.taskData.id ? {...action.taskData, entityStatus: 'idle'} : i)}
        case "ADD-TODOLIST":
            return {...state, [action.todolistData.id]: []}
        case "SET-TASK-ENTITY-STATUS":
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(task => task.id === action.taskId ? {...task, entityStatus: action.status} : task)}
        case "CLEAR-DATA":
            return {}
        default: return state
    }
}

//actions
const removeTask = (todolistId: string, taskId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
const addTask = (todolistId: string, taskData: TaskType) => ({type: 'ADD-TASK', todolistId, taskData} as const)
const setTasks = (todolistId: string, taskData: TaskType[]) => ({type: 'SET-TASKS', todolistId, taskData} as const)
const changeTask = (todolistId: string, taskData: TaskType) => ({type: 'CHANGE-TASK', todolistId, taskData} as const)
const setTaskEntityStatus = (todolistId: string, taskId: string, status: RequestStatusType) => ({type: 'SET-TASK-ENTITY-STATUS', todolistId, taskId, status} as const)

//thunks
export const fetchTasksThunk = (todolistId: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    tasksApi.fetchTasks(todolistId)
        .then(response => {
            dispatch(setTasks(todolistId, response.items))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

export const addTaskThunk = (todolistId: string, title: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setTodolistStatus(todolistId, 'loading'))
    tasksApi.addTask(todolistId, title)
        .then(response => {
            if(response.resultCode === 0) {
                dispatch(addTask(todolistId, response.data.item))
                dispatch(setTodolistStatus(todolistId, 'succeeded'))
            } else {
                handleServerAppError(response, dispatch)
                dispatch(setTodolistStatus(todolistId, 'failed'))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(setTodolistStatus(todolistId, 'failed'))
        })
}

export const removeTaskThunk = (todolistId: string, taskId: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setTaskEntityStatus(todolistId, taskId, 'loading'))
    tasksApi.deleteTask(todolistId, taskId)
        .then(response => {
            if(response.resultCode === 0) {
                dispatch(fetchTasksThunk(todolistId))
                dispatch(setTaskEntityStatus(todolistId, taskId, 'succeeded'))
            } else {
                handleServerAppError(response, dispatch)
                dispatch(setTaskEntityStatus(todolistId, taskId, 'failed'))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(setTaskEntityStatus(todolistId, taskId, 'failed'))
        })
}

export const updateTaskThunk = (todolistId: string, taskId: string, taskData: UpdateTaskType) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) =>{
    dispatch(setTaskEntityStatus(todolistId, taskId, 'loading'))
    tasksApi.updateTask(todolistId, taskId, taskData)
        .then(response => {
            if(response.resultCode === 0) {
                dispatch(changeTask(todolistId, response.data.item))
                dispatch(setTaskEntityStatus(todolistId, taskId, 'succeeded'))
            } else {
                handleServerAppError(response, dispatch)
                dispatch(setTaskEntityStatus(todolistId, taskId, 'failed'))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(setTaskEntityStatus(todolistId, taskId, 'failed'))
        })
}


//types
type ActionType = RemoveTaskType | RemoveTodolistType | AddTaskType
    | AddTodolistType | SetTasksType | SetTodolistsType | ChangeTaskType | SetTaskEntityStatusType | ClearDataType

export type AppTaskType = TaskType & {entityStatus: RequestStatusType}

type StateType = {
    [key: string] : Array<AppTaskType>
}

type RemoveTaskType = ReturnType<typeof removeTask>
type AddTaskType = ReturnType<typeof addTask>
type SetTasksType = ReturnType<typeof setTasks>
type ChangeTaskType = ReturnType<typeof changeTask>
type SetTaskEntityStatusType = ReturnType<typeof setTaskEntityStatus>