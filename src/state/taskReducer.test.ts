
import {AppTaskType, taskReducer} from "./taskReducer";

let initialState: {[key: string] : Array<AppTaskType>}

beforeEach(() => {
    initialState = {
        'todo1': [
            {
                description: 'string',
                title: 'task1',
                status: 0,
                priority: 2,
                startDate: 'string',
                deadline: 'string',
                id: 'task1',
                todoListId: 'string',
                order: 1,
                addedDate: 'string',
                entityStatus: 'idle'
            },
            {
                description: 'string',
                title: 'task2',
                status: 0,
                priority: 2,
                startDate: 'string',
                deadline: 'string',
                id: 'task2',
                todoListId: 'string',
                order: 1,
                addedDate: 'string',
                entityStatus: 'idle'
            },
        ],
        'todo2': [
            {
                description: 'string',
                title: 'task3',
                status: 0,
                priority: 2,
                startDate: 'string',
                deadline: 'string',
                id: 'task3',
                todoListId: 'string',
                order: 1,
                addedDate: 'string',
                entityStatus: 'idle'
            },
            {
                description: 'string',
                title: 'task4',
                status: 0,
                priority: 2,
                startDate: 'string',
                deadline: 'string',
                id: 'task4',
                todoListId: 'string',
                order: 1,
                addedDate: 'string',
                entityStatus: 'idle'
            },
        ]
    }
})

test('task reducer should remove task', () => {
    const action = {type: 'REMOVE-TASK', todolistId: 'todo1', taskId: 'task1'} as const
    const endState = taskReducer(initialState, action)

    expect(endState.todo1.length).toBe(1)
    expect(endState['todo1'][0].title).toBe('task2')
})

test('task reducer should remove task array during removing todolist', () => {
    const action = {type: 'todolist/removeTodolist', payload: 'todo1'} as const
    const endState = taskReducer(initialState, action)

    expect(endState.todo1).toBe(undefined)
})

test('task reducer should add task', () => {
    const task = {
            description: 'string',
            title: 'new task',
            status: 0,
            priority: 2,
            startDate: 'string',
            deadline: 'string',
            id: 'task5',
            todoListId: 'string',
            order: 1,
            addedDate: 'string',
        }
    const action = {type: 'ADD-TASK', todolistId: 'todo2', taskData: task} as const
    const endState = taskReducer(initialState, action)

    expect(endState.todo2.length).toBe(3)
    expect(endState.todo2[0].title).toBe('new task')
})

test('task reducer should create tasks array during adding todolist', () => {
    const todolist = {
        id: 'todo3',
        addedDate: 'string',
        order: 2,
        title: 'todo'
    }
    const action = {type: 'todolist/addTodolist', payload: {...todolist}} as const
    const endState = taskReducer(initialState, action)

    expect(Array.isArray(endState.todo3)).toBe(true)
    expect(endState.todo3.length).toBe(0)
})