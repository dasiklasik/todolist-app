import React, {ChangeEvent, useState} from "react";
import {FilterValuesType, taskType, todolistType} from "./App";
import {Task} from "./Task";

type TodolistPropsType = {
    todolistData: todolistType
    tasksData: Array<taskType>
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, filter: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
 }

export const Todolist = (props: TodolistPropsType) => {

    const [inputValue, setInputValue] = useState('')

    const {
        todolistData,
        tasksData,
        removeTask,
        changeFilter,
        addTask,
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

    const onClickButtonHandler = () => {
        if(inputValue.trim() !== '') {
            addTask(todolistData.id, inputValue.trim())
            setInputValue('')
        }
    }

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    return (
        <div className='todolist'>
            <h3>{todolistData.title}</h3>
            <div>
                <input onChange={(e) => onChangeInputHandler(e)} value={inputValue}/>
                <button onClick={onClickButtonHandler}>+</button>
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

