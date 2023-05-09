import React, {useCallback, useEffect} from "react";
import {Task} from "./Task";
import {AddItemBlock} from "./AddItemBlock";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    changeTodolistFilter,
    changeTodolistTitle,
    removeTodolistThunk,
    TodolistAppType
} from "./state/todolistReducer";
import {
    addTaskThunk,
    fetchTasksThunk, removeTaskThunk, updateTaskThunk
} from "./state/taskReducer";
import {useDispatch, useSelector} from "react-redux";
import {StoreType} from "./state/store";
import {TaskType, UpdateTaskType} from "./api/API";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";

type TodolistPropsType = {
    todolistData: TodolistAppType
 }

export const Todolist = React.memo((props: TodolistPropsType) => {

    const {
        todolistData,
    } = props

    const dispatch = useDispatch<ThunkDispatch<StoreType, void, AnyAction>>()

    useEffect(() => {
        dispatch(fetchTasksThunk(todolistData.id))
    }, [todolistData.id])

    const tasks = useSelector<StoreType, {[key: string] : Array<TaskType>}>(state => state.tasks)

    let taskForTodolist = tasks[todolistData.id]

    if(todolistData.filter === 'active') {
        taskForTodolist = taskForTodolist.filter(task => !task.status)
    } else if (todolistData.filter === 'completed') {
        taskForTodolist = taskForTodolist.filter(task => task.status)
    }

    const changeFilterAll = useCallback(() => dispatch(changeTodolistFilter(todolistData.id, 'all')), [todolistData.id, dispatch, changeTodolistFilter])
    const changeFilterActive = useCallback(() => dispatch(changeTodolistFilter(todolistData.id, 'active')), [todolistData.id, dispatch, changeTodolistFilter])
    const changeFilterCompleted = useCallback(() => dispatch(changeTodolistFilter(todolistData.id, 'completed')), [todolistData.id, dispatch, changeTodolistFilter])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskThunk(todolistData.id, title))
    }, [dispatch, addTaskThunk, todolistData.id])

    const removeTask = useCallback((taskId: string) => {
        dispatch(removeTaskThunk(todolistData.id, taskId))
    }, [dispatch, removeTaskThunk, todolistData.id])


    const removeTodolistWrapper = useCallback(() => {
        dispatch(removeTodolistThunk(todolistData.id))
    }, [dispatch, removeTodolistThunk, todolistData.id])


    const changeTodolistTitleWrapper = useCallback((title: string) => {
        dispatch(changeTodolistTitle(todolistData.id, title))
    }, [dispatch, changeTodolistTitle, todolistData.id])

    const updateTask = useCallback((taskId: string, taskData: UpdateTaskType) => {
        dispatch(updateTaskThunk(todolistData.id, taskId, taskData))
    }, [])

    return (
        <div className='todolist'>
            <div className='flex-wrapper header'>
                <EditableSpan title={todolistData.title} callback={changeTodolistTitleWrapper}/>
                <IconButton
                    color='primary'
                    size='small'
                    aria-label="delete"
                    onClick={removeTodolistWrapper}
                    disabled={todolistData.entityStatus === 'loading'}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
            <AddItemBlock callback={addTask}/>
            <ul>
                {
                    taskForTodolist.map(t => <Task
                        key={t.id}
                        tasksData={t}
                        removeTask={removeTask}
                        updateTask={updateTask}
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
})

