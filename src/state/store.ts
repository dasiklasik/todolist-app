import {combineReducers} from "redux";
import thunk from "redux-thunk";
import {todolistReducer} from "./todolistReducer/todolistReducer";
import {taskReducer} from "./taskReducer/taskReducer";
import {appReducer} from "./appReducer";
import {authReducer} from "./authReducer";
import {configureStore} from "@reduxjs/toolkit";

const reducer = combineReducers({
    todolist: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer,
})

export const store = configureStore({
    reducer: reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}).prepend(thunk),
})

export type StoreType = ReturnType<typeof reducer>
export type DispatchType = typeof store.dispatch