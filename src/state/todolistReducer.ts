import {v1} from "uuid";
import {tasksApi, todolistAPI, TodolistType} from "../api/API";
import {AnyAction, Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {setAppStatus} from "./appReducer";

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
            return [{...action.todolistData, filter: 'all' as FilterValuesType} ,...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        default: return state
    }
}

//actions
export const removeTodolist = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const addTodolist = (todolistData: TodolistType) => ({type: 'ADD-TODOLIST', todolistData} as const)
export const changeTodolistTitle = (todolistId: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', todolistId, title} as const)
export const changeTodolistFilter = (todolistId: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', todolistId, filter} as const)
const setTodolists = (todolistData: TodolistType[]) => ({type: 'SET-TODOLISTS', todolistData} as const)

//thunks
export const fetchTodolistThunk = () => (dispatch: Dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistAPI.fetchTodolists()
        .then(response => {
            dispatch(setAppStatus('succeeded'))
            dispatch(setTodolists(response))
        })
}

export const addTodolistThunk = (title: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    todolistAPI.createTodolist(title)
        .then(response => {
            if(response.resultCode === 0) {
                dispatch(addTodolist(response.data.item))
            }
        })
}


//types
type ActionType = RemoveTodolistType | AddTodolistType | ChangeTodolistTitleType | ChangeTodolistFilterType | SetTodolistsType

export type TodolistAppType = {
    filter: FilterValuesType
} & TodolistType

export type RemoveTodolistType = ReturnType<typeof removeTodolist>
export type AddTodolistType = ReturnType<typeof addTodolist>
type ChangeTodolistTitleType = ReturnType<typeof changeTodolistTitle>
type ChangeTodolistFilterType = ReturnType<typeof changeTodolistFilter>
export type SetTodolistsType = ReturnType<typeof setTodolists>