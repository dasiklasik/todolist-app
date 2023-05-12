import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {todolistReducer} from "./todolistReducer";
import {taskReducer} from "./taskReducer";
import {appReducer} from "./appReducer";
import {authReducer} from "./authReducer";

const reducer = combineReducers({
    todolist: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer,
})

export const store = createStore(reducer, applyMiddleware(thunk))

export type StoreType = ReturnType<typeof reducer>