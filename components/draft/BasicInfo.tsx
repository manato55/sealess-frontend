import React,{useState, useEffect, Dispatch, SetStateAction} from 'react'
import styled from 'styled-components'


type basicProps = {
    setTitle: Dispatch<SetStateAction<string>>
    setContents: Dispatch<SetStateAction<string>>
    title: string,
    contents: string
}

export const BasicInfo = (props: basicProps): React.ReactElement => {    
    const titleHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setTitle(e.target.value)
    }
    const contentsHandler = (e: React.ChangeEvent<HTMLTextAreaElement>):void => {
        props.setContents(e.target.value)
    }

    return (
        <>
            <p>件名</p>
            <TextInput
                type="text"
                value={props.title}
                onChange={(e) => titleHandler(e)}
            />
            <p>説明文</p>
            <TextArea
                value={props.contents}
                onChange={(e) => contentsHandler(e)}
            >
            </TextArea>
        </>
    )
}

const TextInput = styled.input`
    width: 90%;
`;

const TextArea = styled.textarea`
    width: 90%;
    height: 300px;
`;


export default BasicInfo