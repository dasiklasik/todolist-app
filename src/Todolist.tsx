import React from "react";
import {taskType, todolistType} from "./App";
import {Task} from "./Task";

type TodolistPropsType = {
    todolistData: todolistType
    tasksData: Array<taskType>
    removeTask: (todolistId: string, taskId: string) => void
}

export const Todolist = (props: TodolistPropsType) => {

    const {
        todolistData,
        tasksData,
        removeTask,
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
                    tasksData.map(t => <Task todolistId={todolistData.id} tasksData={t} removeTask={removeTask}/>)
                }
            </ul>
        </div>
    )
}

