import React from "react";
import {Task} from "./Task";
import {AddItemBlock} from "./AddItemBlock";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {changeTodolistFilter, changeTodolistTitle, removeTodolist, TodolistType} from "./state/todolistReducer";
import {addTask, changeTaskStatus, changeTaskTitle, removeTask, TaskType} from "./state/taskReducer";
import {useDispatch, useSelector} from "react-redux";
import {StoreType} from "./state/store";

type TodolistPropsType = {
    todolistData: TodolistType
 }

export const Todolist = (props: TodolistPropsType) => {

    const {
        todolistData,
    } = props

    const tasks = useSelector<StoreType, {[key: string] : Array<TaskType>}>(state => state.tasks)
    const dispatch = useDispatch()


    let taskForTodolist = tasks[todolistData.id]

    if(todolistData.filter === 'active') {
        taskForTodolist = taskForTodolist.filter(task => !task.isDone)
    } else if (todolistData.filter === 'completed') {
        taskForTodolist = taskForTodolist.filter(task => task.isDone)
    }

    const changeFilterAll = () => dispatch(changeTodolistFilter(todolistData.id, 'all'))
    const changeFilterActive = () => dispatch(changeTodolistFilter(todolistData.id, 'active'))
    const changeFilterCompleted = () => dispatch(changeTodolistFilter(todolistData.id, 'completed'))

    const addTaskWrapper = (title: string) => {
        dispatch(addTask(todolistData.id, title))
    }

    const removeTaskWrapper = (taskId: string) => {
        dispatch(removeTask(todolistData.id, taskId))
    }

    const changeTaskStatusWrapper = (taskId: string, isDone: boolean) => {
        dispatch(changeTaskStatus(todolistData.id, taskId, isDone))
    }

    const removeTodolistWrapper = () => {
        dispatch(removeTodolist(todolistData.id))
    }

    const changeTaskTitleTodoWrapper = (taskId: string, title: string) => {
       dispatch(changeTaskTitle(todolistData.id, taskId, title))
    }

    const changeTodolistTitleWrapper = (title: string) => {
        dispatch(changeTodolistTitle(todolistData.id, title))
    }

    return (
        <div className='todolist'>
            <div className='flex-wrapper header'>
                <EditableSpan title={todolistData.title} callback={changeTodolistTitleWrapper}/>
                <IconButton color='primary' size='small' aria-label="delete" onClick={removeTodolistWrapper}>
                    <DeleteIcon />
                </IconButton>
            </div>
            <AddItemBlock callback={addTaskWrapper}/>
            <ul>
                {
                    taskForTodolist.map(t => <Task
                        tasksData={t}
                        changeTaskStatus={changeTaskStatusWrapper}
                        removeTask={removeTaskWrapper}
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

