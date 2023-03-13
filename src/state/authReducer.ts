import {Dispatch} from "redux";

const initialState = {
    isAuth: false,
}

export const authReducer = (state = initialState, action: actionType) => {
    switch (action.type) {
        case 'SET-AUTH':
            return {...state, isAuth: action.isAuth}
        default: return state
    }
}

const setAuth = (isAuth: boolean) => ({type: 'SET-AUTH', isAuth} as const)


type initialStateType = typeof initialState

type setAuthType = ReturnType<typeof setAuth>

type actionType = setAuthType