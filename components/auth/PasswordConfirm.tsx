import {Dispatch, SetStateAction} from 'react'
import styled from 'styled-components'
import {useAuth} from '../../hooks/useAuth'


type AuthProps = {
    setPassword: Dispatch<SetStateAction<string>>;
    password: string;
}

export const PasswordConfirm = (props: AuthProps): React.ReactElement  => {

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setPassword(e.target.value)
    }

    return (
        <div>
            <InputText
                type="password"
                value={props.password}
                onChange={(e) => passwordHandler(e)}
                placeholder="パスワード確認"
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


export default PasswordConfirm