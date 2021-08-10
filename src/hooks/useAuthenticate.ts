import React from 'react'
import repository from '../axios/repository'
import { useSetRecoilState,useRecoilState } from 'recoil'
import { http, userStatus, authErrorMessage, eachErrorFlag } from '../store/atom'
import {useRouter} from 'next/router'
import useSWR from 'swr';
import { toast } from 'react-toastify'



export type ErrorFlag = {
    name?: boolean;
    email?: boolean;
    password?: boolean;
    department?: boolean;
    section?: boolean;
    jobTitle?: boolean;
}

type LoginUser = {
    email: string,
    password: string,
}

export const useAuthenticate = () => {
    const setHttpStatus = useSetRecoilState(http);
    const setUser= useSetRecoilState(userStatus);
    const router = useRouter();
    const setErrorMessage = useSetRecoilState(authErrorMessage)
    const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag)

    const _reverseErrorToInital = () => {
        setErrorMessage(undefined)
        setErrorFlag(errorFlag => ({...errorFlag, name:false, department: false, email: false, password: false}))
    }


    return {
        login: async (user: LoginUser) => {
            setErrorMessage(null)
            const res = await repository.post('login',user).catch(error => error.response)
            if(res.status === 200) {
                setUser(res.data.user)
                localStorage.setItem('token', res.data.token);
                // user種別に応じて遷移先を変更
                if(res.data.user.user_type === 0) {
                    router.push('/admin')
                } else if(res.data.user.user_type === 1) {
                    router.push('/dep-admin')
                } else {
                    router.push('/')
                }
            } else if(res.status === 422) {
                setErrorMessage(res.data.errors.message)
            } else {
                setHttpStatus(res.status)
            }
        },

        logout: async() => {
            if(!confirm('ログアウトしますか？')) {
                return
            }
            const res = await repository.post('logout').catch(error => error.response)
            if(res.status === 200) {
                await setUser(undefined)
                localStorage.removeItem('token')
                localStorage.removeItem('data');
                // clearValidationMessage()
                // clearSearchedTask()
                router.push('/login')
            } else {
                setHttpStatus(res.status)
            }
        },

        registerDepAdmin: async(depUser) => {
            _reverseErrorToInital()
            const res = await repository.post('register-dep-admin',depUser).catch(error=>error.response)
            if(res.status === 422) {
                setErrorMessage(res.data.errors)
                const tmp: ErrorFlag = {
                    name: false,
                    email: false,
                    password: false,
                    department: false,
                }
                const Arr = ['name','email','password','department']
                for(let i of Arr) {
                    if(res.data.errors[i]) {
                        tmp[i] = true
                    }
                }
                setErrorFlag({...errorFlag, department: tmp.department, name: tmp.name, password: tmp.password, email: tmp.email})
            } else if(res.status === 200) {
                toast.success('登録しました。') 
            } else {
                setHttpStatus(res.status)
            }
        }

    };
}
