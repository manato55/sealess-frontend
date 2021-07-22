import React, { useContext, useEffect, useState, createContext } from 'react';
import {useRouter} from 'next/router'


export const GlobalContext = createContext({} as {
    token: string;
    asyncLoading: boolean;
    HttpStatusCode: number;
    updateLoading: () => void;
    initializeLoading: () => void;
    httpChangeFunc: (code: number) => void;
});

export const useGlobal = () => {
    return useContext(GlobalContext);
};

export const GlobalProvider = ({children}) => {
    const router = useRouter()
    const [token, setToken] = useState<string>()
    const [asyncLoading, setAsyncLoading] = useState<boolean>(false)
    const [HttpStatusCode, setHttpStatusCode] = useState<number>(null)
    const updateLoading = ():void => setAsyncLoading(true);
    const initializeLoading = ():void => setAsyncLoading(false);
    const httpChangeFunc = (code):void => setHttpStatusCode(code);


    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [router])

    const value = {
        token,
        asyncLoading,
        HttpStatusCode,
        initializeLoading,
        updateLoading,
        httpChangeFunc,
    }

    return <GlobalContext.Provider value={value}>
                {children}
            </GlobalContext.Provider>;
}

export default useGlobal