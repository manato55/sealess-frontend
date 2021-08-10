import {Dispatch, SetStateAction, useCallback} from 'react'
import {useAuth} from '../../hooks/useAuth'
import Input from '../atoms/Input'
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper'
import { useRecoilState } from 'recoil'
import { authErrorMessage } from '../../store/atom'


interface Props {
    setPassword: Dispatch<SetStateAction<string>>
    password: string,
}

export const Password = (props: Props): React.ReactElement  => {
    const {passwordErrFlag} = useAuth();
    const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage)


    const passwordHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setPassword(e.target.value)
    }, [props]);

    return (
        <div>
            <ErrorMessageWrapper>{passwordErrFlag && errorMessage}</ErrorMessageWrapper>
            <Input
                type="password"
                value={props.password}
                onChange={(e) => passwordHandler(e)}
                placeholder="パスワード"
            />
        </div>
    )
}

export default Password