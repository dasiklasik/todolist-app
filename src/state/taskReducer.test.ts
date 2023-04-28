import {taskReducer} from "./taskReducer";
import {addTodolist, removeTodolist, todolistId1} from "./todolistReducer";
import {v1} from "uuid";
import { TaskType } from "../api/API";

let initialState: {[key: string] : Array<TaskType>}

// beforeEach(() => {
//     initialState = {
//         [todolistId1]: [
//             {id: v1(), title: 'HTML', : false},
//             {id: v1(), title: 'CSS', isDone: false},
//             {id: v1(), title: 'React', isDone: false},
//         ],
//         [todolistId2]: [
//             {id: v1(), title: 'Milk', isDone: false},
//             {id: v1(), title: 'Cheese', isDone: false},
//             {id: v1(), title: 'Corn', isDone: false},
//         ],
//     }
//
// })

test('task reducer should remove task', () => {
    // const action = removeTask(todolistId1 ,initialState[todolistId1][0].id)
    // const endState = taskReducer(initialState, action)
    //
    // expect(endState[todolistId1].length).toBe(2)
    // expect(endState[todolistId1][0].title).toBe('CSS')
})

test('task reducer should remove task array during removing todolist', () => {
    const action = removeTodolist(todolistId1)
    const endState = taskReducer(initialState, action)

    expect(endState[todolistId1]).toBe(undefined)
})

test('task reducer should add task', () => {
    // const action = addTask(todolistId1, 'new task')
    // const endState = taskReducer(initialState, action)

    // expect(endState[todolistId1].length).toBe(4)
    // expect(endState[todolistId1][0].title).toBe('new task')
    // expect(endState[todolistId1][0].isDone).toBe(false)
})

test('task reducer should change task status', () => {
    // const action = changeTaskStatus(todolistId1, initialState[todolistId1][0].id, true)
    // const endState = taskReducer(initialState, action)
    //
    // expect(endState[todolistId1].length).toBe(3)
    // // expect(endState[todolistId1][0].isDone).toBe(true)
})

test('task reducer should change task title', () => {
    // const action = changeTaskTitle(todolistId1, initialState[todolistId1][0].id, 'new task title')
    // const endState = taskReducer(initialState, action)
    //
    // expect(endState[todolistId1].length).toBe(3)
    // expect(endState[todolistId1][0].title).toBe('new task title')
})

test('task reducer should create tasks array during adding todolist', () => {
    // const id = v1()
    // const action = addTodolist(id, 'new todolist title')
    // const endState = taskReducer(initialState, action)
    //
    // expect(typeof endState[id]).toBe('object')
    // expect(Array.isArray(endState[id])).toBe(true)
    // expect(endState[id].length).toBe(0)
})