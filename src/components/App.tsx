import React, {useEffect} from 'react';
import './App.css';
import {CircularProgress, Container} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {StoreType} from '../state/store';
import {ErrorSnackbar} from "./ErrorSnackbar/ErrorSnackbar";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {TodolistList} from "./Todolist/TodolistList";
import {Login} from './Login';
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {initApp} from "../state/appReducer";
import {Header} from "./Header/Header";


function App() {

    const dispatch = useDispatch<ThunkDispatch<StoreType, void, AnyAction>>()

    useEffect(() => {
        dispatch(initApp())
    }, [dispatch])

    const isInitialized = useSelector<StoreType, boolean>(state => state.app.isInitialized)

    if (!isInitialized) return <CircularProgress
        style={{width: '200px', height: '200px', display: 'block', margin: 'auto'}}/>


    return (
        <BrowserRouter>
            <div className='app'>
                <Header/>
                <Container fixed>
                    <Routes>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/' element={<TodolistList/>}/>
                        <Route path='*' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    </Routes>
                </Container>
                <ErrorSnackbar/>
            </div>
        </BrowserRouter>
    );
}

export default App;
