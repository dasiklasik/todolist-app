import React, {useEffect} from 'react';
import './App.css';
import {Container} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { StoreType } from '../state/store';
import {ErrorSnackbar} from "./ErrorSnackbar/ErrorSnackbar";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {TodolistList} from "./Todolist/TodolistList";
import { Login } from './Login';
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {initApp} from "../state/appReducer";


function App() {

    const dispatch = useDispatch<ThunkDispatch<StoreType, void, AnyAction>>()

    useEffect(() => {
        dispatch(initApp())
    })

    const isAuth = useSelector<StoreType, boolean>(state => state.auth.isAuth)

    if (!isAuth) return <Login/>


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
