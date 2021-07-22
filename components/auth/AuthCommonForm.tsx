import React,{useState, useEffect, Dispatch, SetStateAction} from 'react'
import styled from 'styled-components'
import {useAuth} from '../../hooks/useAuth'


type AuthProps = {
    setEmail: Dispatch<SetStateAction<string>>
    setPassword: Dispatch<SetStateAction<string>>
    email: string,
    password: string,
}

export const AuthCommonForm = (props: AuthProps): React.ReactElement  => {
    const {errorMsg,  emailErrFlag, passwordErrFlag} = useAuth();


    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setEmail(e.target.value)
    }

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setPassword(e.target.value)
    }

    return (
        <div>
            <ErrorMsg>{emailErrFlag && errorMsg.email[0]}</ErrorMsg>
            <InputText
                type="email"
                value={props.email}
                onChange={(e) => emailHandler(e)}
                placeholder="メールアドレス"
            />
            <ErrorMsg>{passwordErrFlag && errorMsg.password[0]}</ErrorMsg>
            <InputText
                type="password"
                value={props.password}
                onChange={(e) => passwordHandler(e)}
                placeholder="パスワード"
            />
        </div>
    )
}

const ErrorMsg = styled.p`
    color: red;
`;

const InputText = styled.input`
    width: 80%;
    height: 30px;
`;


export default AuthCommonForm