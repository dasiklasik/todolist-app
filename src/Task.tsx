import {taskType} from "./App";
import React from "react";

type TaskPropsType = {
    tasksData: taskType
}
export const Task = (props: TaskPropsType) => {

    const {tasksData} = props

    return (
        <li key={tasksData.id}>
            <input type='checkbox' checked={tasksData.isDone}/>
            {tasksData.title}
        </li>
    )
}