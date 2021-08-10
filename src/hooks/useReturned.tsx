import React, { useContext, useEffect, useState, createContext } from 'react';
import {useRouter} from 'next/router'
import axios from '../axios';
import {useDraft} from './useDraft'
import { useSetRecoilState } from 'recoil'
import { http } from '../store/atom'


interface RT {
    id: number;
    title: string;
    returned_task?: {
        user: {
            section: string;
            name: string;
        };
        user_id: number
    };
    user_id: number;
    updated_at: string;
}

interface RD {
    title: string;
    content: string;
    returned_task?: {
        comment: string
    };
    process: string;
    filename: string;
    id: number;
    agent_statuses: {
        route: string;
        user: {
            name: string;
            id: number;
            department: string;
            section: string;
        }
        agent_user: number;
    }[];
}

interface Data {
    title: string;
    content: string;
    file: File[],
    ppl: object[]
    action: string;
    id: number;
}

export const ReturnedContext = createContext({} as {
    fetchReturnedDetail: (id: number) => void;
    removeFile: (data: {filename: string; id: number}) => void;
    fileRemovalTofalse: () => void;
    fetchReturnedTask: () => void;
    reSubmitReturnedTask: (draft: Data) => void;
    discardReturnedTask: (id: number) => void;
    returnedDetail: RD;
    returnedTask: RT[];
    fileRemoval: boolean;
});

export const useReturned = () => {
    return useContext(ReturnedContext);
};

export const ReturnedProvider = ({children}) => {
    const router = useRouter()
    const [returnedTask, setReturnedTask] = useState<RT[]>()
    const [returnedDetail, setReturnedDetail] = useState<RD>()
    const [fileRemoval, setFileRemoval] = useState<boolean>(false)
    const {registerDraft} = useDraft()
    const setHttpStatus = useSetRecoilState(http)

    async function fetchReturnedTask(): Promise<void> {
        const res = await axios.get('returned/fetch-task').catch(error => error.response)
        if(res.status === 200) {
            setReturnedTask(res.data)
        }
    }

    async function fetchReturnedDetail(id): Promise<void> {
        const res = await axios.get(`returned/fetch-detail/${id}`).catch(error => error.response)
        if(res.status === 200) {
            setReturnedDetail(res.data)
        } else {
            setHttpStatus(res.status)
        }
    }
    
    async function removeFile(data): Promise<void> {
        const res = await axios.post('returned/remove-file',data).catch(error => error.response); 
        if(res.status === 200) {
            setFileRemoval(true)
        }
        setFileRemoval(true)
    }

    async function reSubmitReturnedTask(draft): Promise<void> {
        const res = await registerDraft(draft)
        if(res === 200) {
            router.push('/returned')
        }
        fetchReturnedTask()
    }

    async function discardReturnedTask(id): Promise<void> {
        await axios.post('returned/remove-task',{id:id}).catch(error => error.response); 
        router.push('/returned')
        fetchReturnedTask()
    }

    const fileRemovalTofalse = ():void => setFileRemoval(false); 


    const value = {
        fetchReturnedTask,
        fetchReturnedDetail,
        removeFile,
        fileRemovalTofalse,
        reSubmitReturnedTask,
        discardReturnedTask,
        returnedDetail,
        returnedTask,
        fileRemoval,
    }

    return <ReturnedContext.Provider value={value}>
                {children}
            </ReturnedContext.Provider>;
}

export default useReturned