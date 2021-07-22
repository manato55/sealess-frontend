import {useState} from 'react'
import Email from '../../components/auth/Email'
import AuthWrapper from '../../components/auth/Wrapper'
import Button from '../../components/layouts/Button'
import {useAuth} from '../../hooks/useAuth'


export const PasswordIssuance = (): React.ReactElement => {
    const [email, setEmail] = useState<string>('');
    const {passwordReRegister,linkMessage} = useAuth() 

    const submit = () => {
        if(email === '') {
            alert('メールアドレスを入力してください。')
            return
        }
        if(!confirm('送信しますか？')) {
            return
        }
        passwordReRegister(email)
    }

    return (
        <>
            <AuthWrapper>
                <p>{linkMessage}</p>
                <Email
                    email={email}
                    setEmail={setEmail}
                />
                <Button
                    onClick={() => submit()}
                >
                    送信
                </Button>
            </AuthWrapper>
        </>
    )
}


export default PasswordIssuance