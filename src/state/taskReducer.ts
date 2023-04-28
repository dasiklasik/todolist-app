import { v1 } from "uuid";
import {AddTodolistType, RemoveTodolistType, SetTodolistsType, todolistId1, todolistId2} from "./todolistReducer";
import {AnyAction, Dispatch} from "redux";
import {tasksApi, TaskType} from "../api/API";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";

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
            // return {...state, [action.todolistId]: [{id: v1(), title: action.title, completed: false}, ...state[action.todolistId]]}
        case "CHANGE-TASK-STATUS":
            // return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t)}
        case "CHANGE-TASK-TITLE":
            // return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, title: action.title} : t)}
        case "ADD-TODOLIST":
            // return {...state, [action.todolistId]: []}
        default: return  state
    }
}

//actions
export const removeTask = (todolistId: string, taskId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
export const addTask = (todolistId: string, title: string) => ({type: 'ADD-TASK', todolistId, title} as const)
export const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => ({type: 'CHANGE-TASK-STATUS', todolistId, taskId, isDone} as const)
export const changeTaskTitle = (todolistId: string, taskId: string, title: string) => ({type: 'CHANGE-TASK-TITLE', todolistId, taskId, title} as const)
const setTasks = (todolistId: string, taskData: TaskType[]) => ({type: 'SET-TASKS', todolistId, taskData} as const)

//thunks
export const fetchTasksThunk = (todolistId: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    debugger
    tasksApi.fetchTasks(todolistId)
        .then(response => dispatch(setTasks(todolistId, response.items)))
}

export const addTaskThunk = (todolistId: string, title: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    tasksApi.addTask(todolistId, title)
        .then(response => {
            dispatch(fetchTasksThunk(todolistId))
        })
}


//types
type ActionType = RemoveTaskType | RemoveTodolistType | AddTaskType | ChangeTaskStatusType |
    ChangeTaskTitleType | AddTodolistType | SetTasksType | SetTodolistsType

type StateType = {
    [key: string] : Array<TaskType>
}

type RemoveTaskType = ReturnType<typeof removeTask>
type AddTaskType = ReturnType<typeof addTask>
type ChangeTaskStatusType = ReturnType<typeof changeTaskStatus>
type ChangeTaskTitleType = ReturnType<typeof changeTaskTitle>
type SetTasksType = ReturnType<typeof setTasks>