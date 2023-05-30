import {AnyAction} from "redux";
import {authAPI, FieldsErrorsType, LoginDataType, UserDataType} from "../api/API";
import {setAppStatus} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/erorr-utils";
import {ThunkDispatch} from "redux-thunk";
import {StoreType} from "./store";
import {clearData} from "./todolistReducer/todolistReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

const initialState = {
    isAuth: false,
    id: null as number | null,
    login: null as null | string,
    email: null as null | string,
}

//thunks
export const loginThunk = createAsyncThunk<{ isAuth: true }, LoginDataType, {
    state: StoreType,
    rejectValue: { error: string, fieldsErrors?: FieldsErrorsType[] },
}>('auth/login',
    async (loginData, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus('loading'))
        try {
            const response = await authAPI.login(loginData)
            if (response.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus('succeeded'))
                return {isAuth: true}
            } else {
                return thunkAPI.rejectWithValue({error: response.messages[0], fieldsErrors: response.fieldsErrors})
            }
        } catch (err) {
            const error: AxiosError = err as any
            return thunkAPI.rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })

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


const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload
        },
        setUserData: (state, action: PayloadAction<UserDataType>) => {
            return {...action.payload, isAuth: true}
        }
    }
})

export const authReducer = slice.reducer;

export const {setUserData, setAuth} = slice.actions

