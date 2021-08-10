import React, { useContext, useEffect, useState, createContext } from 'react';
import {useRouter} from 'next/router'
import axios from '../axios'
import { saveAs } from 'file-saver';
import {useGlobal} from './useGlobal';
import {useReturned} from './useReturned';
import { useSetRecoilState } from 'recoil'
import { http } from '../store/atom'



export const ProgressContext = createContext({} as {
    fetchSelectedTask: (id:number) => void;
    actionInProgress: (action: string, id: number) => void;
    actionInEscalation: (action: string, id: number) => void;
    downloadFile:  (data: {
        filename: string;
        id: number;
    }) => void;
    returnToDrafter: (data: {
        id: number;
        comment: string;
    }) => void;
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
        comment?: string;
    };

});

export const useProgress = () => {
    return useContext(ProgressContext);
};

export const ProgressProvider = ({children}) => {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState<{}>()
    const [detailTask, setDetailTask] = useState([])
    const [files, setFiles] = useState<string>()
    const [recievedTask, setRecievedTask] = useState([])
    const {httpChangeFunc,fetchTaskInProgress,getTotalLengthOfTaskInProgress} = useGlobal();
    const {fetchReturnedTask} = useReturned()
    const setHttpStatus = useSetRecoilState(http)
    

    async function fetchSelectedTask(id): Promise<void> {
        const res = await axios.get(`progress/fetch-detail-task/${id}`).catch(error => error.responnse)
        if(res.data.length === 0) {
            httpChangeFunc(404);
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
        const initialPage: number = 1
        if(res.status === 200) {
            router.push(`/progress/index/${initialPage}`)
        }
        fetchReturnedTask()
        fetchTaskInProgress(initialPage)
        getTotalLengthOfTaskInProgress()
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
        fetchSelectedTask,
        actionInProgress,
        actionInEscalation,
        returnToDrafter,
        downloadFile,
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