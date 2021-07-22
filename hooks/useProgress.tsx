import React, { useContext, useEffect, useState, createContext } from 'react';
import {useRouter} from 'next/router'
import axios from '../axios'
import {useGlobal} from './useGlobal';
import { saveAs } from 'file-saver';

type taskInProgress = {
    title: string;
    process: string;
    created_at: string;
    id: number;
}

export const ProgressContext = createContext({} as {
    fetchTaskInProgress: (offset: number) => void;
    fetchSelectedTask: (id:number) => void;
    actionInProgress: (action: string, id: number) => void;
    fetchRecievedTask: () => void;
    getTotalLengthOfTaskInProgress: () => void;
    actionInEscalation: (action: string, id: number) => void;
    downloadFile:  (data: {
        filename: string;
        id: number;
    }) => void;
    returnToDrafter: (data: {
        id: number;
        comment: string;
    }) => void;
    taskInProgress: taskInProgress[];
    paginatedTaskInProgress: taskInProgress[];
    detailTask: any;
    files: string;
    recievedTask: {
        title: string;
        id: number;
        updated_at: string;
        user: {
            name: string;
            section: string;
        }
    }[];
    errorMessage: {
        // 初期のレンダリングではプロパティが入っていないため?を付ける
        comment?: string[]
    };

});

export const useProgress = () => {
    return useContext(ProgressContext);
};

export const ProgressProvider = ({children}) => {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState<{}>()
    const [taskInProgress, setTaskInProgress] = useState([])
    const [detailTask, setDetailTask] = useState([])
    const [files, setFiles] = useState<string>()
    const [recievedTask, setRecievedTask] = useState([])
    const {httpChangeFunc} = useGlobal();
    const [paginatedTaskInProgress, setPaginatedTaskInProgress] = useState([])
    

    async function fetchTaskInProgress(offset): Promise<void> {
        const res = await axios.get(`progress/fetch-in-progress/${offset}`).catch(error => error.responnse)
        setPaginatedTaskInProgress(res.data)
    }

    async function getTotalLengthOfTaskInProgress(): Promise<void> {
        const res = await axios.get('progress/get-total-length').catch(error => error.responnse)
        setTaskInProgress(res.data)
    }

    async function fetchSelectedTask(id): Promise<void> {
        const res = await axios.get(`progress/fetch-detail-task/${id}`).catch(error => error.responnse)
        if(res.data.length === 0) {
            httpChangeFunc(404);
            // router.push('/error')
        } else {
            setDetailTask(res.data)
        }
    }

    async function actionInProgress(action, paramId): Promise<void> {
		const res = await axios.post('progress/action-inprogress',{
            data: {
                action: action,
                id: paramId
            }
        }).catch(error => error.response);
        if(res.status === 200) {
            router.push('/progress/index/1')
        }   
	}

    async function actionInEscalation(action, paramId): Promise<void> {
		const res = await axios.post('progress/action-inescalation',{
            data: {
                action: action,
                id: paramId
            }
        }).catch(error => error.response);
        if(res.status === 200) {
            router.push('/recieve')
        }   
	}

    async function fetchRecievedTask(): Promise<void> {
        const res = await axios.get('progress/fetch-recieved').catch(error => error.response);
        if(res.status === 200) {
            setRecievedTask(res.data)
        }
    }

    async function returnToDrafter(data): Promise<void> {
        setErrorMessage({})
        const res = await axios.post('progress/return',data).catch(error => error.response); 
        if(res.status === 200) {
            router.push('/recieve')
        } else {
            setErrorMessage(res.data.error)
        }
    }

    async function downloadFile(data): Promise<void> {
        const res = await axios.post('progress/fetch-file',{data:data},{responseType: "blob"}).catch(error => error.response)
        const blob = new Blob([res.data], {
            type: res.data.type
        })
        const contentDisposition = res.headers["content-disposition"];
        const fileName = contentDisposition.substring(contentDisposition.indexOf('=') + 1);
        saveAs(blob, fileName);
    }

    const value = {
        fetchTaskInProgress,
        fetchSelectedTask,
        actionInProgress,
        fetchRecievedTask,
        actionInEscalation,
        returnToDrafter,
        downloadFile,
        getTotalLengthOfTaskInProgress,
        paginatedTaskInProgress,
        taskInProgress,
        detailTask,
        files,
        recievedTask,
        errorMessage,
    }

    return <ProgressContext.Provider value={value}>
                {children}
            </ProgressContext.Provider>;
}



export default useProgress