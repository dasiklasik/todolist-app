import {addTodolist, removeTodolist } from "../todolistReducer/todolistReducer";
import {addTaskThunk, AppTaskType, fetchTasksThunk, removeTaskThunk, taskReducer, updateTaskThunk} from "./taskReducer";

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
                todoListId: 'todo1',
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
    const action= removeTaskThunk.fulfilled({resultCode: 0, data: {}, messages: []}, '',
        {todolistId: 'todo1', taskId: 'task1'})
    const endState = taskReducer(initialState, action)

    expect(endState.todo1.length).toBe(1)
    expect(endState['todo1'][0].title).toBe('task2')
})

test('task reducer should remove task array during removing todolist', () => {
    const action = removeTodolist('todo1')
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
            todoListId: 'todo2',
            order: 1,
            addedDate: 'string',
        }

    const response = {
        resultCode: 0,
        messages: [],
        data: {item: task}
    }
    const action = addTaskThunk.fulfilled(response, '', {todolistId: 'todo2', title: ''})
    const endState = taskReducer(initialState, action)
debugger
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
    const action = addTodolist(todolist)
    const endState = taskReducer(initialState, action)

    expect(Array.isArray(endState.todo3)).toBe(true)
    expect(endState.todo3.length).toBe(0)
})

test('tasks should be added for todolist', () => {
    const action = fetchTasksThunk.fulfilled({taskData: initialState['todo1'], todolistId: 'todo1'}, '', 'todo1')

    const endState = taskReducer({
        'todo1': [],
        'todo2': []
    }, action)

    expect(endState.todo1.length).toBe(2)
})

test('tasks reducer should update task', () => {
    const task = {
        title: 'new task1 title',
        description: 'string',
        status: 0,
        priority: 0,
        startDate: 'string',
        deadline: 'string',
    }

    const updatedTask = {
        description: 'string',
        title: 'new task1 title',
        status: 0,
        priority: 0,
        startDate: 'string',
        deadline: 'string',
        id: 'task1',
        todoListId: 'todo1',
        order: 1,
        addedDate: 'string',
        entityStatus: 'idle'
    }

    const response = {
        resultCode: 0,
        messages: [],
        data: {item: updatedTask}
    }

    const action = updateTaskThunk.fulfilled(
        response, '',
        {todolistId: 'todo1', taskId: 'task1', taskData: task})
    const endState = taskReducer(initialState, action)

    expect(endState['todo1'][0].title).toBe('new task1 title')
})