import React, {ChangeEvent, useCallback} from "react";
import {EditableSpan} from "../../EditableSpan/EditableSpan";
import DeleteIcon from "@mui/icons-material/Delete";
import {Checkbox, IconButton} from "@mui/material";
import {TaskType, UpdateTaskType} from "../../../api/API";

type TaskPropsType = {
    tasksData: TaskType
    removeTask: (taskId: string) => void
    updateTask: (taskId: string, taskData: UpdateTaskType) => void
}
export const Task = React.memo((props: TaskPropsType) => {

    const {
        tasksData,
        removeTask,
        updateTask,
    } = props

    const onClickHandler = () => {
        removeTask(tasksData.id)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.target.checked ? 1 : 0
        const updatedTask = {
            title: tasksData.title,
            description: tasksData.description,
            status: status,
            priority: tasksData.priority,
            startDate: tasksData.startDate,
            deadline: tasksData.deadline,
        }
        updateTask(tasksData.id, updatedTask)
    }

    const changeTaskTitleTaskWrapper = useCallback((title: string) => {
        const updatedTask = {
            title: title,
            description: tasksData.description,
            status: tasksData.status,
            priority: tasksData.priority,
            startDate: tasksData.startDate,
            deadline: tasksData.deadline,
        }
        updateTask(tasksData.id, updatedTask)
    }, [updateTask, tasksData.id])

    const taskClassName = tasksData.status ? 'is-done' : ''

    return (
        <li className={taskClassName}>
            <Checkbox color='primary' onChange={onChangeHandler} checked={!!tasksData.status}/>
            <EditableSpan title={tasksData.title} callback={changeTaskTitleTaskWrapper}/>
            <IconButton color='primary' size='small' aria-label="delete" onClick={onClickHandler}>
                <DeleteIcon />
            </IconButton>
        </li>
    )
})