import {taskType} from "./App";
import React from "react";

type TaskPropsType = {
    todolistId: string
    tasksData: taskType
    removeTask: (todolistId: string, taskId: string) => void
}
export const Task = (props: TaskPropsType) => {

    const {
        todolistId,
        tasksData,
        removeTask,
    } = props

    const onClickHandler = () => {
        removeTask(todolistId, tasksData.id)
    }

    return (
        <li key={tasksData.id}>
            <button onClick={onClickHandler}>x</button>
            <input type='checkbox' checked={tasksData.isDone}/>
            {tasksData.title}
        </li>
    )
}