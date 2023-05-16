import {AnyAction} from "redux";
import {authAPI, LoginDataType, UserDataType} from "../api/API";
import {setAppStatus} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/erorr-utils";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {clearData} from "./todolistReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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
        setAuth: (state, action: PayloadAction<{ isAuth: boolean }>) => {
            state.isAuth = action.payload.isAuth
        },
        setUserData: (state, action: PayloadAction<{ userData: UserDataType }>) => {
            state.isAuth = true
            state.id = action.payload.userData.id
            state.login = action.payload.userData.login
            state.email = action.payload.userData.email
        }
    }
})

export const authReducer = slice.reducer;

export const {setUserData, setAuth} = slice.actions

//thunks
export const loginThunk = (loginData: LoginDataType) => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setAppStatus({status: 'loading'}))
    authAPI.login(loginData)
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(setAuth({isAuth: true}))
                dispatch(setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(response, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

export const logoutThunk = () => (dispatch: ThunkDispatch<StoreType, void, AnyAction>) => {
    dispatch(setAppStatus({status: 'loading'}))
    authAPI.logout()
        .then(response => {
            if (response.resultCode === 0) {
                dispatch(setAuth({isAuth: false}))
                dispatch(clearData())
                dispatch(setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(response, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
