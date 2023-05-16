import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {AnyAction} from "redux";
import {authAPI} from "../api/API";
import {setUserData} from "./authReducer";
import {handleServerNetworkError} from "../utils/erorr-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus: (state, action: PayloadAction<RequestStatusType>) => {
            state.status = action.payload
        },
        setAppError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setIsInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload
        }
    }
})

export const appReducer = slice.reducer

//actions
export const {setIsInitialized, setAppStatus, setAppError} = slice.actions

//thunk
export const initApp = () => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    authAPI.authMe()
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(setUserData({...response.data}))
            }
            dispatch(setIsInitialized(true))
            dispatch(setAppStatus('succeeded'))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

//type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetAppErrorType = ReturnType<typeof setAppError>
export type SetAppStatusType = ReturnType<typeof setAppStatus>
