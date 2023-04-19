import {FilterValuesType} from "../App";


const initialState: Array<TodolistType> = []

export const todolistReducer = (state = initialState, action: ActionType): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todolistId)
        default: return state
    }
}


//actions
const removeTodolist = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)

//types
type ActionType = removeTodolistType
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

type removeTodolistType = ReturnType<typeof removeTodolist>