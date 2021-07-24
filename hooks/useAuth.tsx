import React, { useContext, useEffect, useState, createContext,  } from 'react';
import {useRouter} from 'next/router'
import axios from '../axios'
import {useDraft} from './useDraft'
import { toast } from 'react-toastify'


type RegisterUser = {
    name: string,
    email: string,
    password?: string,
    department?: string,
    section?: string,
    jobTitle?: string,
}

type LoginUser = {
    email: string,
    password: string,
}

type User = {
    user_type: number;
    department: string;
    message?: string;
    id: number;
}


export const AuthContext = createContext({} as {
    errorMsg: {
        name: string[],
        email: string[],
        password: string[],
        department: string[],
        section: string[],
        jobTitle: string[],
    };
    user: User;
    nameErrFlag: boolean;
    emailErrFlag: boolean;
    passwordErrFlag: boolean;
    departmentErrFlag: boolean;
    jobTitleErrFlag: boolean;
    sectionErrFlag: boolean;
    loginErrorMessage: string;
    linkMessage: string;
    userInfoFromToken: object | string;
    passwordReRegister: (email: string) => void;
    reRegisterPassword: (data: object) => void;
    login: (user: LoginUser) => void;
    tokenCheck: (token: string) => void;
    passwordTokenCheck: (token: string) => void;
    registerDepAdmin: (depUser: RegisterUser) => void;
    registerOrdinaryUser: (secUser: RegisterUser) => void;
    officialRegistryForOrdinaryUser: (data: {token: string; password: string}) => void;
    logout: () => void;
    me: () => void;
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}) => {
    const [errorMsg, setError] = useState({
        name:[],
        email:[],
        password:[],
        department:[],
        section:[],
        jobTitle:[]
    })
    const router = useRouter()
    const {clearValidationMessage} = useDraft()
    const [nameErrFlag, setNameErrFlag] = useState(false)
    const [departmentErrFlag, setDepartmentErrFlag] = useState(false)
    const [sectionErrFlag, setSectionErrFlag] = useState(false)
    const [jobTitleErrFlag, setJobTitleErrFlag] = useState(false)
    const [emailErrFlag, setEmailErrFlag] = useState(false)
    const [passwordErrFlag, setPasswordErrFlag] = useState(false)
    const [loginErrorMessage, setLoginErrorMessage] = useState('')
    const [user, setUser] = useState<User>()
    const [userInfoFromToken, setUserInfoFromToken] = useState<object>()
    const [linkMessage ,setLinkMessage] = useState<string>('')


    async function login(user: LoginUser): Promise<void> {
        setLoginErrorMessage('')
        const res = await axios.post('login',user).catch(error => error.response)
        if(res.status === 200) {
            localStorage.setItem('token', res.data.token);
            if(res.data.user.user_type === 0) {
                router.push('/admin')
            } else if(res.data.user.user_type === 1) {
                router.push('/dep-admin')
            } else {
                router.push('/')
            }
        } else {
            setLoginErrorMessage(res.data.errors.message)
        }
    }

    async function logout(): Promise<void> {
        const res = await axios.post('logout').catch(error => error.response)
        if(res.status === 200) {
            await setUser(undefined)
            console.log(user)
            localStorage.removeItem('token')
            clearValidationMessage()
            router.push('/login')
        }
    }

    async function me(): Promise<void> {
        const res = await axios.get('me').catch(error => error.response)
        setUser(res.data)
    }

    async function registerDepAdmin(depUser): Promise<void> {
        _reverseErrorToInital()
        const res = await axios.post('register-dep-admin',depUser).catch(error=>error.response)
        if(res.status !== 200) {
            setError(res.data.errors)
            if(res.data.errors.name) {
                setNameErrFlag(true)
            }
            if(res.data.errors.email) {
                setEmailErrFlag(true)
            }
            if(res.data.errors.password) {
                setPasswordErrFlag(true)
            }
            if(res.data.errors.department) {
                setDepartmentErrFlag(true)
            }
        } else {
            toast.success('登録しました。')
        }
    }

    async function registerOrdinaryUser(secUser): Promise<void> {
        _reverseErrorToInital()
        const res = await axios.post('send-register-email',secUser).catch(error=>error.response)
        if(res.status === 200) {
            toast.success('招待メールを送信しました。')
        } else {
            setError(res.data.errors)
            if(res.data.errors.name) {
                setNameErrFlag(true)
            }
            if(res.data.errors.email) {
                setEmailErrFlag(true)
            }
            if(res.data.errors.section) {
                setSectionErrFlag(true)
            }
            if(res.data.errors.jobTitle) {
                setJobTitleErrFlag(true)
            }
        }
    } 

    async function tokenCheck(token): Promise<void> {
        const res = await axios.get(`token-check/${token}`).catch(error=>error.response)
        if(res.data === '') {
            router.push('/404')
        } else {
            setUserInfoFromToken(res.data);
        }
    }

    async function passwordTokenCheck(token): Promise<void> {
        const res = await axios.get(`password-token-check/${token}`).catch(error=>error.response)
        if(res.data === '') {
            router.push('/404')
        } else {
            setUserInfoFromToken(res.data);
        }
    }

    async function officialRegistryForOrdinaryUser(data): Promise<void> {
        _reverseErrorToInital()
        const res = await axios.post('official-registry',data).catch(error=>error.response)
        if(res.status === 200) {
            router.push('/login')
            toast.success('登録完了')
        } else {
            setError(res.data.errors)
            if(res.data.errors.password) {
                setPasswordErrFlag(true)
            }
        }
    }

    async function passwordReRegister(email): Promise<void> {
        setLinkMessage('')
        const res = await axios.post('re-password',{email:email}).catch(error=>error.response)
        if(res.status === 422) {
            setEmailErrFlag(true)
            setError(res.data)
        } else {
            setLinkMessage('メールを送信しました。')
        }
    }

    async function reRegisterPassword(data): Promise<void> {
        _reverseErrorToInital()
        const res = await axios.post('re-register-password',data).catch(error=>error.response)
        if(res.status === 422) {
            setPasswordErrFlag(true)
            setError(res.data)
        } else {
            router.push('/login')
            toast.success('登録完了')
        }
    }

    const _reverseErrorToInital = () => {
        setDepartmentErrFlag(false)
        setNameErrFlag(false)
        setEmailErrFlag(false)
        setPasswordErrFlag(false)
        setSectionErrFlag(false)
        setJobTitleErrFlag(false)
        setError(null)
    }

    const value = {
        login,
        tokenCheck,
        logout,
        setError,
        me,
        passwordTokenCheck,
        registerDepAdmin,
        registerOrdinaryUser,
        officialRegistryForOrdinaryUser,
        passwordReRegister,
        reRegisterPassword,
        linkMessage,
        userInfoFromToken,
        user,
        errorMsg,
        nameErrFlag,
        emailErrFlag,
        passwordErrFlag,
        departmentErrFlag,
        sectionErrFlag,
        jobTitleErrFlag,
        loginErrorMessage,
    }

    return <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>;
}



export default useAuth