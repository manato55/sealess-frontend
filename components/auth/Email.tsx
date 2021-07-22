import {Dispatch, SetStateAction} from 'react'
import styled from 'styled-components'
import {useAuth} from '../../hooks/useAuth'


type AuthProps = {
    setEmail: Dispatch<SetStateAction<string>>
    email: string,
}

export const AuthCommonForm = (props: AuthProps): React.ReactElement  => {
    const {errorMsg,  emailErrFlag} = useAuth();

    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setEmail(e.target.value)
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