import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, IconButton, TextField} from "@mui/material";
import {AddBox} from "@mui/icons-material";

type AddItemBlockPropsType = {
    callback: (title: string) => void
}

export const AddItemBlock = (props: AddItemBlockPropsType) => {

    const {callback} = props

    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState<string | null>(null)



    const onClickButtonHandler = () => {
        if(inputValue.trim() !== '') {
            callback(inputValue.trim())
            setInputValue('')
        } else {
            setError('Title is required!')
        }
    }

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        if(error !== null) {
            setError(null)
        }
    }

    const onEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter' && inputValue.trim() !== '') {
            callback(inputValue.trim())
            setInputValue('')
        } else {
            setError('Title is required!')
        }
    }

    return (
        <div className='add-item-block'>
            <TextField
                error={!!error}
                helperText={error}
                variant='standard'
                onKeyPress={onEnterHandler}
                onChange={onChangeInputHandler}
                value={inputValue}
            />
            <IconButton color='primary' onClick={onClickButtonHandler}>
                <AddBox/>
            </IconButton>
        </div>
    )
}