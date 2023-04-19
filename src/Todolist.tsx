import React from "react";
import {FilterValuesType, taskType} from "./App";
import {Task} from "./Task";
import {AddItemBlock} from "./AddItemBlock";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {TodolistType} from "./state/todolistReducer";

type TodolistPropsType = {
    todolistData: TodolistType
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
                <IconButton color='primary' size='small' aria-label="delete" onClick={removeTodolistCallback}>
                    <DeleteIcon />
                </IconButton>
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
                <Button variant={todolistData.filter === 'all' ? 'outlined' : 'text'} onClick={changeFilterAll}>All</Button>
                <Button variant={todolistData.filter === 'active' ? 'outlined' : 'text'} onClick={changeFilterActive}>Active</Button>
                <Button variant={todolistData.filter === 'completed' ? 'outlined' : 'text'} onClick={changeFilterCompleted}>Completed</Button>
            </div>
        </div>
    )
}

