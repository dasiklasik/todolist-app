import {AnyAction} from "redux";
import {authAPI, LoginDataType, UserDataType} from "../api/API";
import {setAppStatus} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/erorr-utils";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {clearData} from "./todolistReducer";

const initialState = {
    isAuth: false,
    id: null as number | null,
    login: null as null | string,
    email: null as null | string,
}

export const authReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case 'SET-AUTH':
            return {...state, isAuth: action.isAuth}
        case 'SET-USER-DATA':
            return {...state, ...action.userData, isAuth: true}
        default: return state
    }
}

//actions
const setAuth = (isAuth: boolean) => ({type: 'SET-AUTH', isAuth} as const)
export const setUserData = (userData: UserDataType) => ({type: 'SET-USER-DATA', userData} as const)

//thunks
export const loginThunk = (loginData: LoginDataType) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setAppStatus('loading'))
    authAPI.login(loginData)
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(setAuth(true))
                dispatch(setAppStatus('succeeded'))
            } else {
                handleServerAppError(response, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

export const logoutThunk = () => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setAppStatus('loading'))
    authAPI.logout()
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(setAuth(false))
                dispatch(clearData())
                dispatch(setAppStatus('succeeded'))
            } else {
                handleServerAppError(response, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}


type InitialStateType = typeof initialState

type SetAuthType = ReturnType<typeof setAuth>
type SetUserDataType = ReturnType<typeof setUserData>

type ActionType = SetAuthType | SetUserDataType

