import {Dispatch, SetStateAction} from 'react'
import styled from 'styled-components'
import {useAuth} from '../../hooks/useAuth'


type AuthProps = {
    setPassword: Dispatch<SetStateAction<string>>
    password: string,
}

export const Password = (props: AuthProps): React.ReactElement  => {
    const {errorMsg, passwordErrFlag} = useAuth();

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setPassword(e.target.value)
    }

    return (
        <div>
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


export default Password