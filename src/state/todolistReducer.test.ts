import { v1 } from "uuid";
import { TodolistType } from "../api/API";
import {
    addTodolist,
    changeTodolistFilter, changeTodolistTitle,
    removeTodolist,
    todolistId1,
    todolistId2,
    TodolistAppType,
    todolistReducer,
} from "./todolistReducer";

let initialState: Array<TodolistAppType>

beforeEach(() => {
    // initialState = [
    //     {id: todolistId1, title: 'What to learn', filter: 'all'},
    //     {id: todolistId2, title: 'What to buy', filter: 'all'}
    // ]
})

test('todolist reducer should remove todolist', () => {

    const action = removeTodolist(todolistId1)
    const endState = todolistReducer(initialState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].title).toBe('What to buy')
})

test('todolist reducer should add todolist', () => {

    // const id = v1()
    // const action = addTodolist(id, 'new todo')
    // const endState = todolistReducer(initialState, action)
    //
    // expect(endState.length).toBe(3)
    // expect(endState[0].id).toBe(id)
    // expect(endState[0].title).toBe('new todo')
    // // expect(endState[0].filter).toBe('all')
})

test('todolist reducer should change todolist title', () => {
    const action = changeTodolistTitle(todolistId1, 'new todo title')
    const endState = todolistReducer(initialState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].title).toBe('new todo title')
})

test('todolist reducer should change todolist filter', () => {
    const action = changeTodolistFilter(todolistId1, 'active')
    const endState = todolistReducer(initialState, action)

    expect(endState.length).toBe(2)
    // expect(endState[0].filter).toBe('active')
})