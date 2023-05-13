import React, {useCallback, useEffect} from "react";
import {Task} from "./Task/Task";
import {AddItemBlock} from "../AddItemBlock/AddItemBlock";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    changeTodolistFilter,
    removeTodolistThunk,
    TodolistAppType, updateTodolistThunk
} from "../../state/todolistReducer";
import {
    addTaskThunk, AppTaskType,
    fetchTasksThunk, removeTaskThunk, updateTaskThunk
} from "../../state/taskReducer";
import {useDispatch, useSelector} from "react-redux";
import {StoreType} from "../../state/store";
import {UpdateTaskType} from "../../api/API";
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
    }, [dispatch, todolistData.id])

    const tasks = useSelector<StoreType, {[key: string] : Array<AppTaskType>}>(state => state.tasks)

    let taskForTodolist = tasks[todolistData.id]

    if(todolistData.filter === 'active') {
        taskForTodolist = taskForTodolist.filter(task => !task.status)
    } else if (todolistData.filter === 'completed') {
        taskForTodolist = taskForTodolist.filter(task => task.status)
    }

    const changeFilterAll = useCallback(() => dispatch(changeTodolistFilter(todolistData.id, 'all')), [todolistData.id, dispatch])
    const changeFilterActive = useCallback(() => dispatch(changeTodolistFilter(todolistData.id, 'active')), [todolistData.id, dispatch])
    const changeFilterCompleted = useCallback(() => dispatch(changeTodolistFilter(todolistData.id, 'completed')), [todolistData.id, dispatch])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskThunk(todolistData.id, title))
    }, [dispatch, todolistData.id])

    const removeTask = useCallback((taskId: string) => {
        dispatch(removeTaskThunk(todolistData.id, taskId))
    }, [dispatch, todolistData.id])


    const removeTodolistWrapper = useCallback(() => {
        dispatch(removeTodolistThunk(todolistData.id))
    }, [dispatch, todolistData.id])


    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(updateTodolistThunk(todolistData.id, title))
    }, [dispatch, todolistData.id])

    const updateTask = useCallback((taskId: string, taskData: UpdateTaskType) => {
        dispatch(updateTaskThunk(todolistData.id, taskId, taskData))
    }, [dispatch, todolistData.id])

    return (
        <div className='todolist'>
            <div className='flex-wrapper header'>
                <EditableSpan disabled={todolistData.entityStatus === 'loading'} title={todolistData.title} callback={changeTodolistTitle}/>
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
            <AddItemBlock callback={addTask} disabled={todolistData.entityStatus === 'loading'}/>
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

