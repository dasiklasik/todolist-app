import React, {ChangeEvent, useCallback} from "react";
import {EditableSpan} from "./EditableSpan";
import DeleteIcon from "@mui/icons-material/Delete";
import {Checkbox, IconButton} from "@mui/material";
import { TaskType } from "./api/API";

type TaskPropsType = {
    tasksData: TaskType
    removeTask: (taskId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean) => void
    changeTaskTitle: (taskId: string, title: string) => void
}
export const Task = React.memo((props: TaskPropsType) => {

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

    const changeTaskTitleTaskWrapper = useCallback((title: string) => {
        changeTaskTitle(tasksData.id, title)
    }, [changeTaskTitle, tasksData.id])

    const taskClassName = tasksData.completed ? 'is-done' : ''

    return (
        <li key={tasksData.id} className={taskClassName}>
            <Checkbox color='primary' onChange={onChangeHandler} checked={tasksData.completed}/>
            <EditableSpan title={tasksData.title} callback={changeTaskTitleTaskWrapper}/>
            <IconButton color='primary' size='small' aria-label="delete" onClick={onClickHandler}>
                <DeleteIcon />
            </IconButton>
        </li>
    )
})