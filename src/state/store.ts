import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {todolistReducer} from "./todolistReducer";
import {TaskReducer} from "./taskReducer";

const reducer = combineReducers({
    todolist: todolistReducer,
    tasks: TaskReducer,
})

export const store = createStore(reducer, applyMiddleware(thunk))

export type StoreType = ReturnType<typeof reducer>