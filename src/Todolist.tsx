import React from "react";
import {taskType, todolistType} from "./App";

type TodolistPropsType = {
    todolistData: todolistType
    tasksData: Array<taskType>
}

export const Todolist = (props: TodolistPropsType) => {

    const {
        todolistData,
        tasksData,
    } = props

    return (
        <div>
            <h3>{todolistData.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {
                    tasksData.map(t => <Task tasksData={t}/>)
                }
            </ul>
        </div>
    )
}

type TaskPropsType = {
    tasksData: taskType
}

const Task = (props: TaskPropsType) => {

    const {tasksData} = props

    return (
        <li key={tasksData.id}>
            <input type='checkbox' checked={tasksData.isDone}/>
            {tasksData.title}
        </li>
    )
}