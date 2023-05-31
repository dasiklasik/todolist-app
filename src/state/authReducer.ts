import {authAPI, FieldsErrorsType, LoginDataType, UserDataType} from "../api/API";
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
        try {
            const response = await authAPI.login(loginData)
            if (response.resultCode === 0) {
                return {isAuth: true}
            } else {
                return thunkAPI.rejectWithValue({error: response.messages[0], fieldsErrors: response.fieldsErrors})
            }
        } catch (err) {
            const error: AxiosError = err as any
            return thunkAPI.rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })

export const logoutThunk = createAsyncThunk('auth/logout',
    async (param: undefined, thunkAPI) => {
        try {
            const response = await authAPI.logout()
            if (response.resultCode === 0) {
                thunkAPI.dispatch(clearData())
                return {isAuth: false}
            } else {
                return thunkAPI.rejectWithValue({error: response.messages[0], fieldsErrors: response.fieldsErrors})
            }
        } catch (err) {
            const error: AxiosError = err as any
            return thunkAPI.rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })


const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserDataType>) => {
            return {...action.payload, isAuth: true}
        }
    },
    extraReducers: builder => {
        builder
            .addMatcher((action) => [
                loginThunk.fulfilled.type,
                logoutThunk.fulfilled.type,
            ].includes(action.type), (state, action) => {
                state.isAuth = action.payload.isAuth
            })
    }
})

export const authReducer = slice.reducer;

export const {setUserData} = slice.actions

