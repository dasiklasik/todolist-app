import {
    addTodolist,
    changeTodolistFilter, changeTodolistTitle,
    removeTodolist,
    setTodolistStatus,
    TodolistAppType,
    todolistReducer,
} from "./todolistReducer";

let initialState: Array<TodolistAppType>

beforeEach(() => {
    initialState = [
        {
            id: 'todo1',
            addedDate: 'string',
            order: 0,
            title: 'todo1',
            filter: 'all',
            entityStatus: 'idle',
        },
        {
            id: 'todo2',
            addedDate: 'string',
            order: 1,
            title: 'todo2',
            filter: 'all',
            entityStatus: 'idle',
        },
    ]
})

test('todolist reducer should remove todolist', () => {
    const action = removeTodolist('todo1')
    const endState = todolistReducer(initialState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].title).toBe('todo2')
})

test('todolist reducer should add todolist', () => {
    const todo = {
        id: 'todo3',
        addedDate: 'string',
        order: 2,
        title: 'todo3',
    }
    const action = addTodolist(todo)
    const endState = todolistReducer(initialState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].id).toBe('todo3')
    expect(endState[0].title).toBe('todo3')
    expect(endState[0].filter).toBe('all')
})

test('todolist reducer should change todolist title', () => {
    const action = changeTodolistTitle({todolistId: 'todo1', title: 'changed title'})
    const endState = todolistReducer(initialState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].title).toBe('changed title')
})

test('todolist reducer should change todolist filter', () => {
    const action = changeTodolistFilter({todolistId: 'todo1', filter: 'active'})
    const endState = todolistReducer(initialState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].filter).toBe('active')
})

test('todolist reducer should change todolist entity status', () => {
    const action = setTodolistStatus({todolistId: 'todo1', status: 'loading'})
    const endState = todolistReducer(initialState, action)

    expect(endState[0].entityStatus).toBe('loading')
})