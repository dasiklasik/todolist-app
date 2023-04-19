import { v1 } from "uuid";
import {AddTodolistType, RemoveTodolistType} from "./todolistReducer";

const initialState: StateType = {}

export const TaskReducer = (state = initialState, action: ActionType): StateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "REMOVE-TODOLIST":
            delete state[action.todolistId]
            return state
        case "ADD-TASK":
            return {...state, [action.todolistId]: [{id: v1(), title: action.title, isDone: false}, ...state[action.todolistId]]}
        case "CHANGE-TASK-STATUS":
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t)}
        case "CHANGE-TASK-TITLE":
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, title: action.title} : t)}
        case "ADD-TODOLIST":
            return {...state, [action.todolistId]: []}
        default: return  state
    }
}

//actions
const removeTask = (todolistId: string, taskId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
const addTask = (todolistId: string, title: string) => ({type: 'ADD-TASK', todolistId, title} as const)
const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => ({type: 'CHANGE-TASK-STATUS', todolistId, taskId, isDone} as const)
const changeTaskTitle = (todolistId: string, taskId: string, title: string) => ({type: 'CHANGE-TASK-TITLE', todolistId, taskId, title} as const)

//types
type ActionType = RemoveTaskType | RemoveTodolistType | AddTaskType | ChangeTaskStatusType | ChangeTaskTitleType | AddTodolistType

type StateType = {
    [key: string] : Array<TaskType>
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type RemoveTaskType = ReturnType<typeof removeTask>
type AddTaskType = ReturnType<typeof addTask>
type ChangeTaskStatusType = ReturnType<typeof changeTaskStatus>
type ChangeTaskTitleType = ReturnType<typeof changeTaskTitle>