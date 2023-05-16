import React, {ChangeEvent, useCallback} from "react";
import {EditableSpan} from "../../EditableSpan/EditableSpan";
import DeleteIcon from "@mui/icons-material/Delete";
import {Checkbox, IconButton} from "@mui/material";
import {UpdateTaskType} from "../../../api/API";
import { AppTaskType } from "../../../state/taskReducer";
import {useSelector} from "react-redux";
import {StoreType} from "../../../state/store";
import {RequestStatusType} from "../../../state/appReducer";

type TaskPropsType = {
    tasksData: AppTaskType
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
    }, [updateTask, tasksData])

    const taskClassName = tasksData.status ? 'is-done' : ''

    return (
        <li className={taskClassName}>
            <Checkbox color='primary' disabled={tasksData.entityStatus === 'loading'} onChange={onChangeHandler} checked={!!tasksData.status}/>
            <EditableSpan disabled={tasksData.entityStatus === 'loading'} title={tasksData.title} callback={changeTaskTitleTaskWrapper}/>
            <IconButton color='primary' size='small' aria-label="delete" onClick={onClickHandler} disabled={tasksData.entityStatus === 'loading'}>
                <DeleteIcon />
            </IconButton>
        </li>
    )
})