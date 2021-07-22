import React,{useState, useEffect, Dispatch, SetStateAction} from 'react'
import styled from 'styled-components'
import {useAuth} from '../../hooks/useAuth'


interface Props {
    setName: Dispatch<SetStateAction<string>>
    name: string,
}

export const FullName = (props: Props) => {
    const {nameErrFlag, errorMsg} = useAuth();


    const nameHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setName(e.target.value)
    }

    return (
        <>
            <ErrorMsg>{nameErrFlag && errorMsg.name[0]}</ErrorMsg>
            <InputText
                type="text"
                value={props.name}
                onChange={(e) => nameHandler(e)}
                placeholder='氏名'
            />
        </>
    )
}


const ErrorMsg = styled.p`
    color: red;
`;

const InputText = styled.input`
    width: 80%;
    height: 30px;
`;

export default FullName
