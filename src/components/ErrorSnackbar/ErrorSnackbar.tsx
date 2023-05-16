import React from "react";
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import {useDispatch, useSelector} from "react-redux";
import {StoreType} from "../../state/store";
import {setAppError} from "../../state/appReducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export const ErrorSnackbar = () => {
    const error = useSelector<StoreType, string | null>(state => state.app.error)
    const dispatch = useDispatch()

    let open = !!error

    const onCloseHandler = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(setAppError({error: null}))
    }

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onCloseHandler}>
            <Alert onClose={onCloseHandler} severity='error' sx={{width: '100%'}}>
                {error}
            </Alert>
        </Snackbar>
    )
}