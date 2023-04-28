import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {AddBox} from "@mui/icons-material";

type AddItemBlockPropsType = {
    callback: (title: string) => void
}

export const AddItemBlock =  React.memo((props: AddItemBlockPropsType) => {

    const {callback} = props

    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onClickButtonHandler = () => {
        if(inputValue.trim() === '') {
            setError('Title is required!')
        } else {
            callback(inputValue.trim())
            setInputValue('')
        }
    }

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        if(error !== null) {
            setError(null)
        }
    }

    const onEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {

        if(e.key === 'Enter') {
            if(inputValue.trim() === '') {
                setError('Title is required!')
            } else if(inputValue.trim() !== '') {
                callback(inputValue.trim())
                setInputValue('')
            }
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
})

