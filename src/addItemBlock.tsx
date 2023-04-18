import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type AddItemBlockPropsType = {
    callback: (title: string) => void
}

export const AddItemBlock = (props: AddItemBlockPropsType) => {

    const {callback} = props

    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState<string | null>(null)

    const blockClassName = error ? 'error' : ''


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
        <div className={blockClassName}>
            <input onKeyPress={onEnterHandler} onChange={onChangeInputHandler} value={inputValue}/>
            <button onClick={onClickButtonHandler}>+</button>
            {error && <div className='error-message'>{error}</div>}
        </div>
    )
}