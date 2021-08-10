import {Dispatch, SetStateAction, useCallback} from 'react'
import Input from '../atoms/Input'

interface Props {
    setPasswordConfirm: Dispatch<SetStateAction<string>>;
    passwordConfirm: string;
}

export const PasswordConfirm = (props: Props): React.ReactElement  => {

    const passwordHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setPasswordConfirm(e.target.value)
    }, [props]);


    return (
        <div>
            <Input
                type="password"
                value={props.passwordConfirm}
                onChange={(e) => passwordHandler(e)}
                placeholder="パスワード確認"
                marginTop={20}
            />
        </div>
    )
}



export default PasswordConfirm