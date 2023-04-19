import {v1} from "uuid";

export type FilterValuesType = 'all' | 'active' | 'completed'


export const todolistId1 = v1()
export const todolistId2 = v1()

const initialState: Array<TodolistType> = [
    {id: todolistId1, title: 'What to learn', filter: 'all'},
    {id: todolistId2, title: 'What to buy', filter: 'all'}
]

export const todolistReducer = (state = initialState, action: ActionType): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todolistId)
        case "ADD-TODOLIST":
            return [{id: action.todolistId, title: action.title, filter: 'all'} ,...state]
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

//types
type ActionType = RemoveTodolistType | AddTodolistType | ChangeTodolistTitleType | ChangeTodolistFilterType
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type RemoveTodolistType = ReturnType<typeof removeTodolist>
export type AddTodolistType = ReturnType<typeof addTodolist>
type ChangeTodolistTitleType = ReturnType<typeof changeTodolistTitle>
type ChangeTodolistFilterType = ReturnType<typeof changeTodolistFilter>