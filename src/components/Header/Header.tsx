import {AppBar, Button, LinearProgress, Toolbar} from "@mui/material";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {StoreType} from "../../state/store";
import { RequestStatusType } from "../../state/appReducer";
import {logoutThunk} from "../../state/authReducer";

export const Header = () => {

    const status = useSelector<StoreType, RequestStatusType>(state => state.app.status)
    const isAuth = useSelector<StoreType, boolean>(state => state.auth.isAuth)
    const dispatch = useDispatch<ThunkDispatch<StoreType, void, AnyAction>>()

    const logoutUser = useCallback(() => {
        dispatch(logoutThunk())
    }, [dispatch])

    const loginUser = useCallback(() => {
        return <Navigate to={'/login'}/>
    }, [])



    return (
        <AppBar position={'static'}>
            <Toolbar>
                {isAuth ? <Button onClick={logoutUser} color={'secondary'} variant="contained">Log out</Button>
                    : <Button onClick={loginUser} color={'secondary'} variant="contained">Log in</Button> }
            </Toolbar>
            {status === 'loading' && <LinearProgress color={'secondary'}/>}
        </AppBar>
    )
}