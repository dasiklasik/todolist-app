import {AnyAction} from "redux";
import {authAPI, LoginDataType} from "../api/API";
import {setAppStatus} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/erorr-utils";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {clearData} from "./todolistReducer";
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuth: false,
    id: null as number | null,
    login: null as null | string,
    email: null as null | string,
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuth = action.payload.isAuth
        },
        setUserData: (state, action) => {
            state = {...state, ...action.payload.userData, isAuth: true}
        }
    }
})

export const authReducer = slice.reducer;

export const {setUserData, setAuth} = slice.actions

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

