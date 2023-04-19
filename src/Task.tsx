import {taskType} from "./App";
import React, {ChangeEvent} from "react";
import {EditableSpan} from "./EditableSpan";
import DeleteIcon from "@mui/icons-material/Delete";
import {Checkbox, IconButton} from "@mui/material";
import {CheckBox} from "@mui/icons-material";

type TaskPropsType = {
    tasksData: taskType
    removeTask: (taskId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean) => void
    changeTaskTitle: (taskId: string, title: string) => void
}
export const Task = (props: TaskPropsType) => {

    const {
        tasksData,
        removeTask,
        changeTaskStatus,
        changeTaskTitle,
    } = props

    const onClickHandler = () => {
        removeTask(tasksData.id)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(tasksData.id, e.target.checked)
    }

    const changeTaskTitleTaskWrapper = (title: string) => {
        changeTaskTitle(tasksData.id, title)
    }

    const taskClassName = tasksData.isDone ? 'is-done' : ''

    return (
        <li key={tasksData.id} className={taskClassName}>
            <Checkbox color='primary' onChange={onChangeHandler} checked={tasksData.isDone}/>
            <EditableSpan title={tasksData.title} callback={changeTaskTitleTaskWrapper}/>
            <IconButton color='primary' size='small' aria-label="delete" onClick={onClickHandler}>
                <DeleteIcon />
            </IconButton>
        </li>
    )
}