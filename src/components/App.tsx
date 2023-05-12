import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from "./Todolist/Todolist";
import {AddItemBlock} from "./AddItemBlock/AddItemBlock";
import {Container, Grid, LinearProgress, Paper} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { StoreType } from '../state/store';
import {addTodolist, addTodolistThunk, fetchTodolistThunk, TodolistAppType} from "../state/todolistReducer";
import {AnyAction} from "redux";
import { ThunkDispatch } from 'redux-thunk';
import {RequestStatusType} from "../state/appReducer";
import {ErrorSnackbar} from "./ErrorSnackbar/ErrorSnackbar";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {TodolistList} from "./Todolist/TodolistList";
import { Login } from './Login';


function App() {



    return (
        <BrowserRouter>
            <div className='app'>

                <Container fixed>
                    <Routes>
                        <Route path='/' element={<TodolistList/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='*' element={<h1>404: PAGE NOT FOUND</h1>} />

                    </Routes>
                </Container>
                <ErrorSnackbar/>
            </div>
        </BrowserRouter>
    );
}

export default App;
