import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    callback: (title: string) => void
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {

    const {
        title,
        callback,
    } = props

    const [editMode, setEditMode] = useState(false)
    const [inputValue, setInputValue] = useState(title)

    const activateEditMode = () => {
        setEditMode(true)
    }

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const onBlurInputHandler = () => {
        if(inputValue.trim() !== '') {
            callback(inputValue.trim())
            setEditMode(false)
        }
    }

    const onEnterInputHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter' && inputValue.trim() !== '') {
            callback(inputValue.trim())
            setEditMode(false)
        }
    }

    return (
        <>
            {editMode ?
                <TextField size='small' autoFocus onBlur={onBlurInputHandler} onKeyPress={onEnterInputHandler} onChange={onChangeInputHandler} value={inputValue}/>
                : <span onDoubleClick={activateEditMode}>{title}</span>}
        </>
    )
})