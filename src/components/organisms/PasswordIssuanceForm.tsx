import React,{Dispatch, SetStateAction, useCallback} from 'react'
import Button from '../atoms/Button';
import FormWrapper from '../atoms/FormWrapper';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Input from '../atoms/Input'
import { useRecoilValue } from 'recoil'
import { authErrorMessage } from '../../store/atom'
import {useAuth} from '../../hooks/useAuth'



interface Props {
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
}

export const PasswordIssuanceForm = (props: Props): React.ReactElement => {
    const errorMessage = useRecoilValue(authErrorMessage)
    const {passwordReRegister,linkMessage} = useAuth() 


    const emailHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            props.setEmail(e.target.value)
        },
        [props],
    );

    const handleSubmit = useCallback(
        (e: React.ChangeEvent<HTMLFormElement>): void => {
            e.preventDefault();
            if(props.email === '') {
                alert('メールアドレスを入力してください。')
                return
            }
            if(!confirm('送信しますか？')) {
                return
            }
            passwordReRegister(props.email)
        },
        [props, passwordReRegister]
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
                    />
                    <Button
                        type='submit'
                    >
                        送信
                    </Button>
                </form>
            </FormWrapper>
        </>
    )
}

export default React.memo(PasswordIssuanceForm)
