import React, {useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {Todolist} from "./Todolist";
import {AddItemBlock} from "./addItemBlock";

const todolistId1 = v1()
const todolistId2 = v1()

export type FilterValuesType = 'all' | 'active' | 'completed'

export type todolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type taskType = {
    id: string
    title: string
    isDone: boolean
}

const todolistsInitial: Array<todolistType> = [
    {id: todolistId1, title: 'What to learn', filter: 'all'},
    {id: todolistId2, title: 'What to buy', filter: 'all'}
]

const tasksInitial = {
    [todolistId1]: [
        {id: v1(), title: 'HTML', isDone: false},
        {id: v1(), title: 'CSS', isDone: false},
        {id: v1(), title: 'React', isDone: false},
    ],
    [todolistId2]: [
        {id: v1(), title: 'Milk', isDone: false},
        {id: v1(), title: 'Cheese', isDone: false},
        {id: v1(), title: 'Corn', isDone: false},
    ],
}


function App() {

    const [todolists, setTodolists] = useState(todolistsInitial)
    const [tasks, setTasks] = useState(tasksInitial)

    const removeTask = (todolistId: string, taskId: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(task => task.id !== taskId)})
    }

    const changeFilter = (todolistId: string, filter: FilterValuesType) => {
        setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, filter} : tl))
    }

    const addTask = (todolistId: string, title: string) => {
        const task = {id: v1(), title, isDone: false}
        setTasks({...tasks, [todolistId]: [task ,...tasks[todolistId]]})

    }

    const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, isDone} : t)})
    }

    const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, title} : t)})
    }

    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todolistId))
        delete tasks[todolistId]
    }

    const addTodolist = (title: string) => {
        const id = v1()
        setTodolists([{id, title, filter: 'all'}, ...todolists])
        setTasks({...tasks, [id]: []})
    }

    const changeTodolistTitle = (todolistId: string, title: string) => {
        setTodolists(todolists.map(tl => tl.id === todolistId ? {...tl, title} : tl))
    }

    return (
        <div className='wrapper'>
            <AddItemBlock callback={addTodolist}/>
            <div className='todolists-container'>
                {todolists.map(tl => {
                    return <Todolist
                        key={tl.id}
                        todolistData={tl}
                        tasksData={tasks[tl.id]}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodolist={removeTodolist}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
                })}
            </div>
        </div>
    );
}

export default App;
