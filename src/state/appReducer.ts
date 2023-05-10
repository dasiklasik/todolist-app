
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

//type
type InitialStateType = typeof initialState
type ActionType = SetAppStatusType | SetAppErrorType

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetAppStatusType = ReturnType<typeof setAppStatus>
export type SetAppErrorType = ReturnType<typeof setAppError>