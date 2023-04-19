import {FilterValuesType} from "../App";


const initialState: Array<TodolistType> = []

export const todolistReducer = (state = initialState, action: ActionType): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todolistId)
        case "ADD-TODOLIST":
            return [...state, {id: action.todolistId, title: action.title, filter: 'all'}]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
        default: return state
    }
}

//actions
const removeTodolist = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
const addTodolist = (todolistId: string, title: string) => ({type: 'ADD-TODOLIST', todolistId, title} as const)
const changeTodolistTitle = (todolistId: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', todolistId, title} as const)

//types
type ActionType = removeTodolistType | addTodolistType | changeTodolistTitleType
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

type removeTodolistType = ReturnType<typeof removeTodolist>
type addTodolistType = ReturnType<typeof addTodolist>
type changeTodolistTitleType = ReturnType<typeof changeTodolistTitle>