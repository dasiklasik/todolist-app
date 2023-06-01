import {todolistAPI, TodolistType} from "../../api/API";
import {AnyAction} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "../store";
import {RequestStatusType, setAppStatus} from "../appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/erorr-utils";
import {addTaskThunk, fetchTasksThunk} from "../taskReducer/taskReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'todolist',
    initialState: [] as Array<TodolistAppType>,
    reducers: {
        removeTodolist: (state, action: PayloadAction<string>) => {
            const index = state.findIndex(tl => tl.id === action.payload)
            if (index !== -1) {
                state.splice(index, 1)
            }
        },
        addTodolist: (state, action: PayloadAction<TodolistType>) => {
            state.unshift({...action.payload, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitle: (state, action: PayloadAction<{todolistId: string, title: string}>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) {
                state[index].title = action.payload.title
            }
        },
        changeTodolistFilter: (state, action: PayloadAction<{todolistId: string, filter: FilterValuesType}>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) {
                state[index].filter = action.payload.filter
            }
        },
        setTodolists: (state, action: PayloadAction<TodolistType[]>) => {
            return action.payload.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        setTodolistStatus: (state, action: PayloadAction<{todolistId: string, status: RequestStatusType}>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) {
                state[index].entityStatus = action.payload.status
            }
        },
        clearData: () => {
            return []
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addTaskThunk.pending, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.meta.arg.todolistId)
                if (index !== -1) {
                    state[index].entityStatus = 'loading'
                }
            })
            .addCase(addTaskThunk.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.meta.arg.todolistId)
                if (index !== -1) {
                    state[index].entityStatus = action.payload.resultCode === 0 ? 'succeeded' : 'failed'
                }
            })
            .addCase(addTaskThunk.rejected, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.meta.arg.todolistId)
                if (index !== -1) {
                    state[index].entityStatus = 'failed'
                }
            })
    }
})

export const todolistReducer = slice.reducer

//actions
export const {addTodolist, setTodolistStatus, changeTodolistFilter,
    changeTodolistTitle, removeTodolist, setTodolists, clearData} = slice.actions

//thunks
export const fetchTodolistThunk = () => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setAppStatus('loading'))
    todolistAPI.fetchTodolists()
        .then(response => {
            dispatch(setAppStatus('succeeded'))
            dispatch(setTodolists(response))
            return response
        })
        .then(response => {
            response.forEach(item => {
                dispatch(fetchTasksThunk(item.id))
            })
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

export const addTodolistThunk = (title: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    todolistAPI.createTodolist(title)
        .then(response => {
            if(response.resultCode === 0) {
                dispatch(addTodolist(response.data.item))
            } else {
                handleServerAppError(response, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

export const removeTodolistThunk = (todolistId: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setTodolistStatus({todolistId, status: 'loading'}))
    todolistAPI.deleteTodolist(todolistId)
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(removeTodolist(todolistId))
                dispatch(setTodolistStatus({todolistId, status: 'succeeded'}))
            } else {
                handleServerAppError(response, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

export const updateTodolistThunk = (todolistId: string, title: string) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    todolistAPI.updateTodolist(todolistId, title)
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(changeTodolistTitle({todolistId, title}))
            } else {
                handleServerAppError(response, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}


//types
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistAppType = {
    filter: FilterValuesType
    entityStatus: RequestStatusType
} & TodolistType