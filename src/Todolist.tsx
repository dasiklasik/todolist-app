import React from "react";
import {FilterValuesType, taskType, todolistType} from "./App";
import {Task} from "./Task";
import {AddItemBlock} from "./addItemBlock";
import {EditableSpan} from "./EditableSpan";

type TodolistPropsType = {
    todolistData: todolistType
    tasksData: Array<taskType>
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, filter: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
 }

export const Todolist = (props: TodolistPropsType) => {

    const {
        todolistData,
        tasksData,
        removeTask,
        changeFilter,
        addTask,
        changeTaskStatus,
        removeTodolist,
        changeTaskTitle,
        changeTodolistTitle,
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

    const allBtnClassName = todolistData.filter === 'all' ? 'active-filter' : ''
    const activeBtnClassName = todolistData.filter === 'active' ? 'active-filter' : ''
    const completedBtnClassName = todolistData.filter === 'completed' ? 'active-filter' : ''

    const removeTodolistCallback = () => {
        removeTodolist(todolistData.id)
    }

    const changeTaskTitleTodoWrapper = (taskId: string, title: string) => {
        changeTaskTitle(todolistData.id, taskId, title)
    }

    const changeTodolistTitleWrapper = (title: string) => {
        changeTodolistTitle(todolistData.id, title)
    }

    return (
        <div className='todolist'>
            <div className='flex-wrapper header'>
                <EditableSpan title={todolistData.title} callback={changeTodolistTitleWrapper}/>
                <button onClick={removeTodolistCallback}>x</button>
            </div>
            <AddItemBlock callback={addTaskItem}/>
            <ul>
                {
                    taskForTodolist.map(t => <Task
                        tasksData={t}
                        changeTaskStatus={changeTaskStatusWrapper}
                        removeTask={removeTaskItem}
                        changeTaskTitle={changeTaskTitleTodoWrapper}
                    />)
                }
            </ul>
            <div>
                <button className={allBtnClassName} onClick={changeFilterAll}>All</button>
                <button className={activeBtnClassName} onClick={changeFilterActive}>Active</button>
                <button className={completedBtnClassName} onClick={changeFilterCompleted}>Completed</button>
            </div>
        </div>
    )
}

