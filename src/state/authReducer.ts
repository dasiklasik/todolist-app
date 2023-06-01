import {authAPI, LoginDataType, UserDataType} from "../api/API";
import {clearData} from "./todolistReducer/todolistReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

//thunks
export const loginThunk = createAsyncThunk('auth/login',
    async (loginData: LoginDataType, {rejectWithValue}) => {
        try {
            const response = await authAPI.login(loginData)
            if (response.resultCode === 0) {
                return;
            } else {
                return rejectWithValue({error: response.messages[0], fieldsErrors: response.fieldsErrors})
            }
        } catch (err) {
            const error: AxiosError = err as any
            return rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })

export const logoutThunk = createAsyncThunk('auth/logout',
    async (param: undefined, {dispatch, rejectWithValue}) => {
        try {
            const response = await authAPI.logout()
            if (response.resultCode === 0) {
                dispatch(clearData())
                return;
            } else {
                return rejectWithValue({error: response.messages[0], fieldsErrors: response.fieldsErrors})
            }
        } catch (err) {
            const error: AxiosError = err as any
            return rejectWithValue({error: error.message, fieldsErrors: undefined})
        }
    })


const slice = createSlice({
    name: 'auth',
    initialState: {
        isAuth: false,
        id: null as number | null,
        login: null as null | string,
        email: null as null | string,
    },
    reducers: {
        setUserData: (state, action: PayloadAction<UserDataType>) => {
            return {...action.payload, isAuth: true}
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginThunk.fulfilled, (state) => {
                state.isAuth = true
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.isAuth = false
            })
    }
})

export const authReducer = slice.reducer;

export const {setUserData} = slice.actions

