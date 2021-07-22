import React,{useState, useEffect, Dispatch, SetStateAction} from 'react'
import styled from 'styled-components'


type basicProps = {
    title: string,
    contents: string
}

export const BasicInfoInProgress = (props: basicProps): React.ReactElement => {    

    return (
        <>
            <p>件名</p>
            <TextInput>{props.title}</TextInput>
            <p>説明文</p>
            <TextArea>{props.contents}</TextArea>
        </>
    )
}

const TextInput = styled.p`
    width: 90%;
    border: 1px solid black;
    padding: 10px;
`;

const TextArea = styled.p`
    width: 90%;
    height: 300px;
    border: 1px solid black;
    padding: 10px;
`;


export default BasicInfoInProgress