import {Container, Grid, LinearProgress, Paper} from "@mui/material";
import {AddItemBlock} from "../AddItemBlock/AddItemBlock";
import {Todolist} from "./Todolist";
import React, {useCallback, useEffect} from "react";
import {addTodolist, addTodolistThunk, fetchTodolistThunk, TodolistAppType} from "../../state/todolistReducer";
import {useDispatch, useSelector} from "react-redux";
import {StoreType} from "../../state/store";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {RequestStatusType} from "../../state/appReducer";
import {Login} from "../Login";

export const TodolistList = () => {

    const isAuth = useSelector<StoreType, boolean>(state => state.auth.isAuth)

    const todolists = useSelector<StoreType, Array<TodolistAppType>>(state => state.todolist)
    const dispatch = useDispatch<ThunkDispatch<StoreType, void, AnyAction>>()
    const status = useSelector<StoreType, RequestStatusType>(state => state.app.status)


    useEffect(() => {
        if (isAuth) {
            dispatch(fetchTodolistThunk())
        }
    }, [])

    const addTodolistWrapper = useCallback((title: string) => {
        dispatch(addTodolistThunk(title))
    }, [dispatch, addTodolist])

    if (!isAuth) return <Login/>

    return (
        <div className='wrapper'>
            {status === 'loading' && <LinearProgress/>}
            <Container fixed>
                <Grid container>
                    <AddItemBlock callback={addTodolistWrapper}/>
                </Grid>

                <Grid container spacing={3} style={{marginTop: '20px'}}>
                    {todolists.map(tl => {
                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    todolistData={tl}
                                />
                            </Paper>
                        </Grid>
                    })}
                </Grid>

            </Container>
        </div>
    )
}