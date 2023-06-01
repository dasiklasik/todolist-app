import {authAPI} from "../api/API";
import {loginThunk, logoutThunk, setUserData} from "./authReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTaskThunk, fetchTasksThunk, updateTaskThunk} from "./taskReducer/taskReducer";
import {AxiosError} from "axios";

//thunk
export const initApp = createAsyncThunk('app/initApp',
    async (param: undefined, {rejectWithValue, dispatch}) => {
        try {
            const response = await authAPI.authMe()
            if (response.resultCode === 0) {
                dispatch(setUserData({...response.data}))
            }
        } catch (err) {
            const error: AxiosError = err as any
            return rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'loading' as RequestStatusType,
        error: null as null | string,
        isInitialized: false,
    },
    reducers: {
        setAppStatus: (state, action: PayloadAction<RequestStatusType>) => {
            state.status = action.payload
        },
        setAppError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(initApp.fulfilled, (state) => {
                state.status = 'succeeded'
                state.isInitialized = true
            })
            .addMatcher((action) => [
                loginThunk.pending.type,
                logoutThunk.pending.type,
            ].includes(action.type), (state) => {
                state.status = 'loading'
            })
            .addMatcher((action) => [
                loginThunk.fulfilled.type,
                logoutThunk.fulfilled.type,
            ].includes(action.type), (state) => {
                state.status = 'succeeded'
            })
            .addMatcher((action) => [
                    loginThunk.rejected.type,
                    logoutThunk.rejected.type,
                    addTaskThunk.rejected.type,
                    fetchTasksThunk.rejected.type,
                    updateTaskThunk.rejected.type,
                ].includes(action.type),
                (state, action) => {
                    state.status = 'failed'
                    state.error = action.payload && action.payload.error ? action.payload.error : 'Some error occurred'
                })
    }
})

export const appReducer = slice.reducer

//actions
export const {setAppStatus, setAppError} = slice.actions

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetAppErrorType = ReturnType<typeof setAppError>
export type SetAppStatusType = ReturnType<typeof setAppStatus>
