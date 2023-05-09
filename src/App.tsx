import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {AddItemBlock} from "./AddItemBlock";
import {Container, Grid, LinearProgress, Paper} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { StoreType } from './state/store';
import {addTodolist, addTodolistThunk, fetchTodolistThunk, TodolistAppType} from "./state/todolistReducer";
import {AnyAction} from "redux";
import { ThunkDispatch } from 'redux-thunk';
import {RequestStatusType} from "./state/appReducer";
import {ErrorSnackbar} from "./ErrorSnackbar";


function App() {

    const todolists = useSelector<StoreType, Array<TodolistAppType>>(state => state.todolist)
    const status = useSelector<StoreType, RequestStatusType>(state => state.app.status)
    const dispatch = useDispatch<ThunkDispatch<StoreType, void, AnyAction>>()

    useEffect(() => {
        dispatch(fetchTodolistThunk())
    }, [])

    const addTodolistWrapper = useCallback((title: string) => {
        dispatch(addTodolistThunk(title))
    }, [dispatch, addTodolist])

    return (
        <div className='app'>
            {status === 'loading' && <LinearProgress/>}

            <div className='wrapper'>
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
            <ErrorSnackbar/>
        </div>
    );
}

export default App;
