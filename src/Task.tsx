import {taskType} from "./App";
import React, {ChangeEvent} from "react";

type TaskPropsType = {
    tasksData: taskType
    removeTask: (taskId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean) => void
}
export const Task = (props: TaskPropsType) => {

    const {
        tasksData,
        removeTask,
        changeTaskStatus,
    } = props

    const onClickHandler = () => {
        removeTask(tasksData.id)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(tasksData.id, e.target.checked)
    }

    const taskClassName = tasksData.isDone ? 'is-done' : ''

    return (
        <li key={tasksData.id} className={taskClassName}>
            <button onClick={onClickHandler}>x</button>
            <input type='checkbox' onChange={onChangeHandler} checked={tasksData.isDone}/>
            {tasksData.title}
        </li>
    )
}