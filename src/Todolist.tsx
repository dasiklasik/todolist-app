import React from "react";
import {taskType, todolistType} from "./App";
import {Task} from "./Task";

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
        <div className='todolist'>
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

