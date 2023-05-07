const initialState = {
    status: 'loading' as RequestStatusType
}

export const appReducer = (state : InitialStateType= initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case 'SET-APP-STATUS':
            return {...state, status: action.status}
        default: return state
    }
}

//actions
export const setAppStatus = (status: RequestStatusType) => ({type: 'SET-APP-STATUS', status} as const)

//type
type InitialStateType = typeof initialState
type ActionType = SetAppStatusType

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetAppStatusType = ReturnType<typeof setAppStatus>