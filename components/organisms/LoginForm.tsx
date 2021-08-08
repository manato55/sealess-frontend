import React,{Dispatch, SetStateAction, useCallback} from 'react'
import Button from '../atoms/Button';
import FormWrapper from '../atoms/FormWrapper';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Input from '../atoms/Input'
import {useAuth} from '../../hooks/useAuth'
import styled from 'styled-components'
import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { loginErrorMessage } from '../../store/atom'


interface Props {
    email: string;
    password: string;
    setEmail: Dispatch<SetStateAction<string>>
    setPassword: Dispatch<SetStateAction<string>>
}


type User = {
    email: string,
    password: string,
}

export const LoginForm = (props: Props) => {
    const {login} = useAuth();
    const errorMessage = useRecoilValue(loginErrorMessage)


    const emailHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            props.setEmail(e.target.value)
        },
        [props],
    );

    const passwordHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            props.setPassword(e.target.value)
        },
        [props],
    );

    const handleSubmit = useCallback(
            (e: React.ChangeEvent<HTMLFormElement>): void => {
                e.preventDefault();
                const user: User = {
                email: props.email,
                password: props.password,
            }
            login(user);
        },
        [props, login]
    );


    return (
        <>
            <FormWrapper>
                <ErrorMessageWrapper>{errorMessage}</ErrorMessageWrapper>
                <form onSubmit={handleSubmit}>
                    <Input 
                        type='email'
                        value={props.email}
                        placeholder={'メールアドレス'}
                        onChange={(e) => emailHandler(e)}
                        marginTop={20}
                    />
                    <Input 
                        type='password'
                        value={props.password}
                        placeholder={'パスワード'}
                        onChange={(e) => passwordHandler(e)}
                        marginTop={20}
                    />
                    <Button
                        type='submit'
                    >
                        ログイン
                    </Button>
                    <PassIssuanceLink>
                        <Link href="/password-issuance" passHref>
                            <A>パスワード再発行</A>
                        </Link>
                    </PassIssuanceLink>
                </form>
            </FormWrapper>
        </>
    )
}


const PassIssuanceLink = styled.div`
    margin-top: 10px;
    text-align: left;
`;

const A = styled.a`
    text-decoration: underline;
    color: blue;
`;

export default React.memo(LoginForm)