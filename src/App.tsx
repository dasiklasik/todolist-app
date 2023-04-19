import React, {useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {Todolist} from "./Todolist";
import {AddItemBlock} from "./AddItemBlock";
import {Container, Grid, Paper} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { StoreType } from './state/store';
import {addTodolist, TodolistType} from "./state/todolistReducer";


function App() {

    const todolists = useSelector<StoreType, Array<TodolistType>>(state => state.todolist)
    const dispatch = useDispatch()

    const addTodolistWrapper = (title: string) => {
        const id = v1()
        dispatch(addTodolist(id, title))
    }

    return (
        <div className='wrapper'>
            <Container fixed>
                <Grid container>
                    <AddItemBlock callback={addTodolistWrapper}/>
                </Grid>

                <Grid container spacing={3} style={{marginTop: '20px'}}>
                    {todolists.map(tl => {
                        return <Grid item>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    key={tl.id}
                                    todolistData={tl}
                                />
                            </Paper>
                        </Grid>
                    })}
                </Grid>

            </Container>
        </div>
    );
}

export default App;
