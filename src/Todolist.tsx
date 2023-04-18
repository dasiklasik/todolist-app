import React from "react";
import {FilterValuesType, taskType, todolistType} from "./App";
import {Task} from "./Task";

type TodolistPropsType = {
    todolistData: todolistType
    tasksData: Array<taskType>
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, filter: FilterValuesType) => void
 }

export const Todolist = (props: TodolistPropsType) => {

    const {
        todolistData,
        tasksData,
        removeTask,
        changeFilter,
    } = props

    let taskForTodolist = tasksData

    if(todolistData.filter === 'active') {
        taskForTodolist = taskForTodolist.filter(task => !task.isDone)
    } else if (todolistData.filter === 'completed') {
        taskForTodolist = taskForTodolist.filter(task => task.isDone)
    }

    const changeFilterAll = () => changeFilter(todolistData.id, 'all')
    const changeFilterActive = () => changeFilter(todolistData.id, 'active')
    const changeFilterCompleted = () => changeFilter(todolistData.id, 'completed')

    return (
        <div className='todolist'>
            <h3>{todolistData.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {
                    taskForTodolist.map(t => <Task todolistId={todolistData.id} tasksData={t} removeTask={removeTask}/>)
                }
            </ul>
            <div>
                <button onClick={changeFilterAll}>All</button>
                <button onClick={changeFilterActive}>Active</button>
                <button onClick={changeFilterCompleted}>Completed</button>
            </div>
        </div>
    )
}

