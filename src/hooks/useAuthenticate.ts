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
    content?: boolean;
    route?: boolean;
    title?: boolean;
    file?: boolean;
}

type LoginUser = {
    email: string,
    password: string,
}

export const useAuthenticate = () => {
    const setHttpStatus = useSetRecoilState(http);
    const setUser= useSetRecoilState(userStatus);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage)
    const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag)


    return {
        login: async (user: LoginUser) => {
            setErrorMessage({...errorMessage, general: null})
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
                setErrorMessage({...errorMessage,  general: res.data.errors.message})
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
                router.push('/login')
            } else {
                setHttpStatus(res.status)
            }
        },

        registerDepAdmin: async(depUser) => {
            setErrorFlag({...errorFlag, name:false, department: false, email: false, password: false})
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
        },

        registerOrdinaryUser: async(secUser) => {
            setErrorFlag({...errorFlag, name:false, section: false, email: false, jobTitle: false})
            const res = await repository.post('send-register-email',secUser).catch(error=>error.response)
            if(res.status === 200) {
                toast.success('招待メールを送信しました。')
            } else if(res.status === 422) {
                setErrorMessage(res.data.errors)
                const tmp: ErrorFlag = {
                    name: false,
                    email: false,
                    section: false,
                    jobTitle: false,
                }
                const Arr = ['name','email','section','jobTitle']
                for(let i of Arr) {
                    if(res.data.errors[i]) {
                        tmp[i] = true
                    }
                }
                setErrorFlag({...errorFlag, jobTitle: tmp.jobTitle, name: tmp.name, section: tmp.section, email: tmp.email})
            } else {
                setHttpStatus(res.status)
            }
        },

        tokenCheck: async(token) => {
            const res = await repository.get(`token-check/${token}`).catch(error=>error.response)
            if(res.data === '') {
                setHttpStatus(404)
            } else  {
                if(res.status === 200) {
                    return res.data;
                } else {
                    setHttpStatus(res.status)
                }
            }
        },

        officialRegistryForOrdinaryUser: async(data) => {
            setErrorFlag({...errorFlag, password: false})
            const res = await repository.post('official-registry',data).catch(error=>error.response)
            if(res.status === 200) {
                router.push('/login')
                toast.success('登録完了')
            } else if(res.status === 422) {
                setErrorMessage(res.data.errors)
                setErrorFlag({...errorFlag, password: true})
            } else {
                setHttpStatus(res.status)
            }
        },

        passwordReRegister: async(email) => {
            setErrorFlag({...errorFlag, email: false})
            const res = await repository.post('re-password',{email:email}).catch(error=>error.response)
            if(res.status === 422) {
                setErrorMessage(res.data.email)
                setErrorFlag({...errorFlag, email: true})
            } else if(res.status === 200) {
                return res.status
            } else {
                setHttpStatus(res.status)
            }
        },

        passwordTokenCheck: async(token) => {
            const res = await repository.get(`password-token-check/${token}`).catch(error=>error.response)
            if(res.data === '') {
                setHttpStatus(404)
            } else  {
                if(res.status === 200) {
                    return res.data;
                } else {
                    setHttpStatus(res.status)
                }
            }
        },

        reRegisterPassword: async(data) => {
            setErrorFlag({...errorFlag, password: false})
            const res = await repository.post('re-register-password',data).catch(error=>error.response)
            if(res.status === 422) {
                setErrorMessage(res.data.errors)
                setErrorFlag({...errorFlag, password: true})
            } else if(res.status === 200) {
                router.push('/login')
                toast.success('登録完了')
            } else {
                setHttpStatus(res.status)
            }
        }

    };
}
