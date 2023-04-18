import React, {ChangeEvent, useState} from "react";
import {FilterValuesType, taskType, todolistType} from "./App";
import {Task} from "./Task";
import {AddItemBlock} from "./addItemBlock";

type TodolistPropsType = {
    todolistData: todolistType
    tasksData: Array<taskType>
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, filter: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
 }

export const Todolist = (props: TodolistPropsType) => {


    const {
        todolistData,
        tasksData,
        removeTask,
        changeFilter,
        addTask,
        changeTaskStatus,
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

    const addTaskItem = (title: string) => {
        addTask(todolistData.id, title)
    }

    const removeTaskItem = (taskId: string) => {
        removeTask(todolistData.id, taskId)
    }

    const changeTaskStatusWrapper = (taskId: string, isDone: boolean) => {
        changeTaskStatus(todolistData.id, taskId, isDone)
    }



    return (
        <div className='todolist'>
            <h3>{todolistData.title}</h3>
            <AddItemBlock callback={addTaskItem}/>
            <ul>
                {
                    taskForTodolist.map(t => <Task tasksData={t} changeTaskStatus={changeTaskStatusWrapper} removeTask={removeTaskItem}/>)
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

