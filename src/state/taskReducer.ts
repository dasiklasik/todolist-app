import {
    AddTodolistType,
    RemoveTodolistType,
    setTodolistStatus,
    SetTodolistsType,
    todolistId1,
    todolistId2
} from "./todolistReducer";
import {AnyAction, Dispatch} from "redux";
import {tasksApi, TaskType, UpdateTaskType} from "../api/API";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {setAppError, setAppStatus} from "./appReducer";

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
            return {...state, [action.todolistId]: [...action.taskData]}
        case "REMOVE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "REMOVE-TODOLIST":
            delete state[action.todolistId]
            return state
        case "ADD-TASK":
            return {...state, [action.todolistId]: [action.taskData, ...state[action.todolistId]]}
        case "CHANGE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(i => i.id === action.taskData.id ? action.taskData : i)}
        case "ADD-TODOLIST":
            return {...state, [action.todolistData.id]: []}
        default: return state
    }
}

//actions
const removeTask = (todolistId: string, taskId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
const addTask = (todolistId: string, taskData: TaskType) => ({type: 'ADD-TASK', todolistId, taskData} as const)
const setTasks = (todolistId: string, taskData: TaskType[]) => ({type: 'SET-TASKS', todolistId, taskData} as const)
const changeTask = (todolistId: string, taskData: TaskType) => ({type: 'CHANGE-TASK', todolistId, taskData} as const)

//thunks
export const fetchTasksThunk = (todolistId: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    tasksApi.fetchTasks(todolistId)
        .then(response => {
            dispatch(setTasks(todolistId, response.items))
        })
        .catch(error => {
            dispatch(setAppStatus('failed'))
            dispatch(setAppError(error.message))
        })
}

export const addTaskThunk = (todolistId: string, title: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setTodolistStatus(todolistId, 'loading'))
    tasksApi.addTask(todolistId, title)
        .then(response => {
            if(response.resultCode === 0) {
                dispatch(addTask(todolistId, response.data.item))
                dispatch(setTodolistStatus(todolistId, 'succeeded'))
            } else {
                dispatch(setAppError(response.messages[0]))
                dispatch(setTodolistStatus(todolistId, 'failed'))
            }
        })
        .catch(error => {
            dispatch(setAppError(error))
            dispatch(setAppStatus('failed'))
        })
}

export const removeTaskThunk = (todolistId: string, taskId: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    tasksApi.deleteTask(todolistId, taskId)
        .then(response => {
            if(response.resultCode === 0) {
                dispatch(fetchTasksThunk(todolistId))
            }
        })
        .catch(error => {
            dispatch(setAppStatus('failed'))
            dispatch(setAppError(error.message))
        })
}

export const updateTaskThunk = (todolistId: string, taskId: string, taskData: UpdateTaskType) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) =>{
    tasksApi.updateTask(todolistId, taskId, taskData)
        .then(response => {
            debugger
            if(response.resultCode === 0) {
                dispatch(changeTask(todolistId, response.data.item))
            } else {
                dispatch(setAppStatus('failed'))
                dispatch(setAppError(response.messages[0]))
            }
        })
        .catch(error => {
            dispatch(setAppStatus('failed'))
            dispatch(setAppError(error.message))
        })
}


//types
type ActionType = RemoveTaskType | RemoveTodolistType | AddTaskType
    | AddTodolistType | SetTasksType | SetTodolistsType | ChangeTaskType

type StateType = {
    [key: string] : Array<TaskType>
}

type RemoveTaskType = ReturnType<typeof removeTask>
type AddTaskType = ReturnType<typeof addTask>
type SetTasksType = ReturnType<typeof setTasks>
type ChangeTaskType = ReturnType<typeof changeTask>