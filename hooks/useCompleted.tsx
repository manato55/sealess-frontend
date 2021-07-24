import React, { useContext, useEffect, useState, createContext } from 'react';
import {useRouter} from 'next/router'
import axios from '../axios';
import {useGlobal} from './useGlobal';



type task = {
    id: number;
    title: string;
    process: string;
    updated_at: string;
}


export const CompletedContext = createContext({} as {
    fetchCompletedTask: (choice: string) => Promise<void>;
    discardTask: (id: number) => Promise<void>;
    fetchCompletetTaskDetail: (id: number) => Promise<void>;
    completedTask: task[];
    detailTask: any;

});

export const useCompleted = () => {
    return useContext(CompletedContext);
};

export const CompletedProvider = ({children}) => {
    const router = useRouter()
    const [completedTask, setCompletedTask] = useState<task[]>()
    const {httpChangeFunc} = useGlobal();
    const [detailTask, setDetailTask] = useState([])



    async function fetchCompletedTask(choice): Promise<void> {
        const res = await axios.get(`completed/fetch-task/${choice}`).catch(error => error.response); 
        if(res.status === 200) {
            setCompletedTask(res.data)
        }
    }

    async function fetchCompletetTaskDetail(id): Promise<void> {
        const res = await axios.get(`completed/fetch-detail-task/${id}`).catch(error => error.responnse)
        console.log(res.data)
        if(res.data.length === 0) {
            httpChangeFunc(404);
        } else {
            setDetailTask(res.data)
        }
    }

    async function discardTask(id): Promise<void> {
        const res = await axios.post('completed/discard-task',{id:id}).catch(error => error.response); 
        if(res.status === 200) {
            router.push('/history')
        }
    }


    const value = {
        fetchCompletedTask,
        discardTask,
        fetchCompletetTaskDetail,
        completedTask,
        detailTask,
    }

    return <CompletedContext.Provider value={value}>
                {children}
            </CompletedContext.Provider>;
}



export default useCompleted