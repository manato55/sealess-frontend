import React, { useContext, useEffect, useState, createContext } from 'react';
import {useRouter} from 'next/router'
import axios from '../axios'
import useSWR from 'swr';


type taskInProgress = {
    title: string;
    process: string;
    created_at: string;
    id: number;
}

export const GlobalContext = createContext({} as {
    token: string;
    asyncLoading: boolean;
    HttpStatusCode: number;
    taskInProgress: taskInProgress[];
    paginatedTaskInProgress: taskInProgress[];
    updateLoading: () => void;
    initializeLoading: () => void;
    httpChangeFunc: (code: number) => void;
    getTotalLengthOfTaskInProgress: () => void;
    fetchTaskInProgress: (offset: number) => void;

});

export const useGlobal = () => {
    return useContext(GlobalContext);
};

export const GlobalProvider = ({children}) => {
    const router = useRouter()
    const [token, setToken] = useState<string>()
    const [asyncLoading, setAsyncLoading] = useState<boolean>(false)
    const [HttpStatusCode, setHttpStatusCode] = useState<number>(404)
    const updateLoading = ():void => setAsyncLoading(true);
    const initializeLoading = ():void => setAsyncLoading(false);
    const httpChangeFunc = (code):void => setHttpStatusCode(code);
    const [taskInProgress, setTaskInProgress] = useState([])
    const [paginatedTaskInProgress, setPaginatedTaskInProgress] = useState([])


    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [router])

    async function fetchTaskInProgress(offset): Promise<void> {
        const res = await axios.get(`progress/fetch-in-progress/${offset}`).catch(error => error.responnse)
        setPaginatedTaskInProgress(res.data)
    }
    

    async function getTotalLengthOfTaskInProgress(): Promise<void> {
        const res = await axios.get('progress/get-total-length').catch(error => error.responnse)
        setTaskInProgress(res.data)
    }


    const value = {
        token,
        asyncLoading,
        HttpStatusCode,
        paginatedTaskInProgress,
        taskInProgress,
        initializeLoading,
        updateLoading,
        httpChangeFunc,
        fetchTaskInProgress,
        getTotalLengthOfTaskInProgress
    }

    return <GlobalContext.Provider value={value}>
                {children}
            </GlobalContext.Provider>;
}

export default useGlobal