import React, {useEffect, useState} from 'react'
import AuthCommonForm from '../components/auth/AuthCommonForm'
import {useAuth} from '../hooks/useAuth'
import styled from 'styled-components'
import Common from '../styles/Common.module.scss'
import Button from '../components/layouts/Button'
import Link from 'next/link'

type User = {
    email: string,
    password: string,
}

export const Login = (): React.ReactElement => {
    const {login, loginErrorMessage} = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    const submit = async() => {
        const user: User = {
            email: email,
            password: password,
        }
        await login(user)
    }

    return (
        <div className={Common.auth_wrapper}>
            <ErrorMsg>{loginErrorMessage}</ErrorMsg>
            <AuthCommonForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
            />
            <Button
                onClick={() => submit()}
            >
                ログイン
            </Button>
            <PassIssuanceLink>
                <Link href="/password-issuance">
                    <a><SpanWrappedByA>パスワード再発行</SpanWrappedByA></a>
                </Link>
            </PassIssuanceLink>
        </div>
    )
}

const ErrorMsg = styled.p`
    color: red;
`;

const PassIssuanceLink = styled.div`
    margin-top: 10px;
    text-align: left;
`;

const SpanWrappedByA = styled.span`
    text-decoration: underline;
    color: blue;
`;


export default Login