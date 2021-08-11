import React,{Dispatch, SetStateAction} from 'react'
import {useAuth} from '../../hooks/useAuth'
import Input from '../atoms/Input'
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper'
import { useRecoilValue } from 'recoil'
import { authErrorMessage, eachErrorFlag } from '../../store/atom'



type Props = {
    setEmail: Dispatch<SetStateAction<string>>
    setPassword: Dispatch<SetStateAction<string>>
    email: string,
    password: string,
}

export const RegisterCommonForm = (props: Props): React.ReactElement  => {
    const errorMessage = useRecoilValue(authErrorMessage)
    const errorFlag = useRecoilValue(eachErrorFlag)
    


    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setEmail(e.target.value)
    }

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setPassword(e.target.value)
    }

    return (
        <div>
            <ErrorMessageWrapper>{errorFlag.email && errorMessage.email[0]}</ErrorMessageWrapper>
            <Input
                type="email"
                value={props.email}
                onChange={(e) => emailHandler(e)}
                placeholder="メールアドレス"
            />
            <ErrorMessageWrapper>{errorFlag.password && errorMessage.password[0]}</ErrorMessageWrapper>
            <Input
                type="password"
                value={props.password}
                onChange={(e) => passwordHandler(e)}
                placeholder="パスワード"
            />
        </div>
    )
}



export default RegisterCommonForm