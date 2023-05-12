import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {AnyAction} from "redux";
import {authAPI} from "../api/API";
import {setUserData} from "./authReducer";

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
}

export const appReducer = (state : InitialStateType= initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case 'SET-APP-STATUS':
            return {...state, status: action.status}
        case 'SET-APP-ERROR':
            return {...state, error: action.error}
        default: return state
    }
}

//actions
export const setAppStatus = (status: RequestStatusType) => ({type: 'SET-APP-STATUS', status} as const)
export const setAppError = (error: string | null) => ({type: 'SET-APP-ERROR', error} as const)


//thunk
export const initApp = () => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    authAPI.authMe()
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(setUserData(response.data))
            }
        })
}

//type
type InitialStateType = typeof initialState
type ActionType = SetAppStatusType | SetAppErrorType

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetAppStatusType = ReturnType<typeof setAppStatus>
export type SetAppErrorType = ReturnType<typeof setAppError>