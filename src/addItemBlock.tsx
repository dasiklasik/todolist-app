import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type AddItemBlockPropsType = {
    callback: (title: string) => void
}

export const AddItemBlock = (props: AddItemBlockPropsType) => {

    const {callback} = props

    const [inputValue, setInputValue] = useState('')


    const onClickButtonHandler = () => {
        if(inputValue.trim() !== '') {
            callback(inputValue.trim())
            setInputValue('')
        }
    }

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const onEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter' && inputValue.trim() !== '') {
            callback(inputValue.trim())
            setInputValue('')
        }
    }

    return (
        <div>
            <input onKeyPress={e => onEnterHandler(e)} onChange={(e) => onChangeInputHandler(e)} value={inputValue}/>
            <button onClick={onClickButtonHandler}>+</button>
        </div>
    )
}