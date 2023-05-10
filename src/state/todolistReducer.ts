import {v1} from "uuid";
import {tasksApi, todolistAPI, TodolistType} from "../api/API";
import {AnyAction, Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {RequestStatusType, setAppStatus} from "./appReducer";

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
            return [{...action.todolistData, filter: 'all' as FilterValuesType, entityStatus: 'idle' as RequestStatusType} ,...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        case "SET-TODOLIST-STATUS":
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.status} : tl)
        default: return state
    }
}

//actions
export const removeTodolist = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const addTodolist = (todolistData: TodolistType) => ({type: 'ADD-TODOLIST', todolistData} as const)
export const changeTodolistTitle = (todolistId: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', todolistId, title} as const)
export const changeTodolistFilter = (todolistId: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', todolistId, filter} as const)
const setTodolists = (todolistData: TodolistType[]) => ({type: 'SET-TODOLISTS', todolistData} as const)
export const setTodolistStatus = (todolistId: string, status: RequestStatusType) => ({type: 'SET-TODOLIST-STATUS', todolistId, status} as const)

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

export const removeTodolistThunk = (todolistId: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setTodolistStatus(todolistId, 'loading'))
    todolistAPI.deleteTodolist(todolistId)
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(removeTodolist(todolistId))
                dispatch(setTodolistStatus(todolistId, 'succeeded'))
            }
        })
}

export const updateTodolistThunk = (todolistId: string, title: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    todolistAPI.updateTodolist(todolistId, title)
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(changeTodolistTitle(todolistId, title))
            }
        })
}


//types
type ActionType = RemoveTodolistType | AddTodolistType | ChangeTodolistTitleType | ChangeTodolistFilterType
    | SetTodolistsType | SetTodolistStatus

export type TodolistAppType = {
    filter: FilterValuesType
    entityStatus: RequestStatusType
} & TodolistType

export type RemoveTodolistType = ReturnType<typeof removeTodolist>
export type AddTodolistType = ReturnType<typeof addTodolist>
type ChangeTodolistTitleType = ReturnType<typeof changeTodolistTitle>
type ChangeTodolistFilterType = ReturnType<typeof changeTodolistFilter>
export type SetTodolistsType = ReturnType<typeof setTodolists>
export type SetTodolistStatus = ReturnType<typeof setTodolistStatus>