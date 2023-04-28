import {v1} from "uuid";
import {tasksApi, todolistAPI, TodolistType} from "../api/API";
import {Dispatch} from "redux";

export type FilterValuesType = 'all' | 'active' | 'completed'


export const todolistId1 = v1()
export const todolistId2 = v1()

let initialState: Array<TodolistAppType> = []

export const todolistReducer = (state = initialState, action: ActionType): Array<TodolistType> => {
    switch (action.type) {
        case "SET-TODOLISTS":
            return [...action.todolistData]
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todolistId)
        case "ADD-TODOLIST":
            return state
            // return [{id: action.todolistId, title: action.title, filter: 'all'} ,...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        default: return state
    }
}

//actions
export const removeTodolist = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const addTodolist = (todolistId: string, title: string) => ({type: 'ADD-TODOLIST', todolistId, title} as const)
export const changeTodolistTitle = (todolistId: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', todolistId, title} as const)
export const changeTodolistFilter = (todolistId: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', todolistId, filter} as const)
const setTodolists = (todolistData: TodolistType[]) => ({type: 'SET-TODOLISTS', todolistData} as const)

//thunks
export const fetchTodolistThunk = () => (dispatch: Dispatch) => {
    todolistAPI.fetchTodolists()
        .then(response => {
            dispatch(setTodolists(response))
        })
}

//types
type ActionType = RemoveTodolistType | AddTodolistType | ChangeTodolistTitleType | ChangeTodolistFilterType | SetTodolistsType

export type TodolistAppType = TodolistType & {
    filter: FilterValuesType
}

export type RemoveTodolistType = ReturnType<typeof removeTodolist>
export type AddTodolistType = ReturnType<typeof addTodolist>
type ChangeTodolistTitleType = ReturnType<typeof changeTodolistTitle>
type ChangeTodolistFilterType = ReturnType<typeof changeTodolistFilter>
export type SetTodolistsType = ReturnType<typeof setTodolists>