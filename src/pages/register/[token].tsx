import React, {useEffect, useState, useCallback} from 'react'
import {useRouter} from 'next/router'
import {useAuth} from '../../hooks/useAuth'
import Password from '../../components/molecules/Password'
import Button from '../../components/atoms/Button'
import AuthWrapper from '../../components/atoms/AuthWrapper'


export const Token = ():  React.ReactElement  => {
    const router = useRouter();
    const {tokenCheck,userInfoFromToken, officialRegistryForOrdinaryUser} = useAuth();
    const [paramsToken, setParamsToken] = useState<any>(router.query.token)
    const [tokenChecker, setTokenChecker] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')

    useEffect(() => {
        if(paramsToken !== undefined) {
            const initialAction = async() => {
                await tokenCheck(paramsToken)
            }
            initialAction()
        }
    }, [paramsToken])

    useEffect(() => {
        if(userInfoFromToken !== '' && userInfoFromToken !== undefined) {
            setTokenChecker(true)
        }
    }, [userInfoFromToken])

    async function submitRegister(): Promise<void> {
        const data: {
            token: string; 
            password: string
        } = {
            token: paramsToken,
            password: password
        }
        await officialRegistryForOrdinaryUser(data)
    } 


    return (
        <>
            {tokenChecker ? 
                <AuthWrapper>
                    <Password
                        password={password}
                        setPassword={setPassword}
                    />
                    <Button
                        onClick={() => submitRegister()}
                    >
                        登録
                    </Button>
                </AuthWrapper>
            :'Loading...'}
        </>
    )
}



export default Token