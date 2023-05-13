import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {AnyAction} from "redux";
import {authAPI} from "../api/API";
import {setUserData} from "./authReducer";
import {handleServerNetworkError} from "../utils/erorr-utils";

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
}

export const appReducer = (state : InitialStateType= initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case 'SET-APP-STATUS':
            return {...state, status: action.status}
        case 'SET-APP-ERROR':
            return {...state, error: action.error}
        case 'SET-IS-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default: return state
    }
}

//actions
export const setAppStatus = (status: RequestStatusType) => ({type: 'SET-APP-STATUS', status} as const)
export const setAppError = (error: string | null) => ({type: 'SET-APP-ERROR', error} as const)
export const setIsInitialized = (isInitialized: boolean) => ({type: 'SET-IS-INITIALIZED', isInitialized} as const)


//thunk
export const initApp = () => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    authAPI.authMe()
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(setUserData(response.data))
            }
            dispatch(setIsInitialized(true))
            dispatch(setAppStatus('succeeded'))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

//type
type InitialStateType = typeof initialState
type ActionType = SetAppStatusType | SetAppErrorType | SetIsInitializedType

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetAppStatusType = ReturnType<typeof setAppStatus>
export type SetAppErrorType = ReturnType<typeof setAppError>
export type SetIsInitializedType = ReturnType<typeof setIsInitialized>