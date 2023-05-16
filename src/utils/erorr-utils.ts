import {ResponseType} from "../api/API";
import {Dispatch} from "redux";
import {setAppError, SetAppErrorType, setAppStatus, SetAppStatusType} from "../state/appReducer";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppError({error: data.messages[0]}))
    } else {
        dispatch(setAppError({error: 'Some error occurred'}))
    }
    dispatch(setAppStatus({status: 'failed'}))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppError({error: error.message}))
    dispatch(setAppStatus({status: 'failed'}))
}

type ErrorUtilsDispatchType = Dispatch<SetAppStatusType | SetAppErrorType>