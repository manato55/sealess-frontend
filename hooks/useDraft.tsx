import React, { useContext, useEffect, useState, createContext } from 'react';
import {useRouter} from 'next/router'
import axios from '../axios'

type Unreached = {
    id: number;
    title: string;
    user: {
        name: string;
    };
    created_at: string;
}

type SelectedUnreached = {
    title: string;
    content: string;
    filename: string;
}


export const DraftContext = createContext({} as {
    fetchSectionPpl: (section: string) => void;
    fetchUnreachedTask: () => void;
    registerDraft: (draft: object) => any;
    fetchSelectedUnreachedTask: (id: number) => void;
    sectionPpl: {
        name: string
        id: number
    }[];
    validationMessage: {
        title?: string;
        content?: string;
        route?: string;
    };
    unreachedTask: Unreached[];
    selectedUnreachedTask: SelectedUnreached[];
    clearValidationMessage: () => void;
});

export const useDraft = () => {
    return useContext(DraftContext);
};

export const DraftProvider = ({children}) => {
    const router = useRouter()
    const [sectionPpl, setSectionPpl] = useState<{name:string,id:number}[]>([]);
    const [validationMessage, setValidationMessage] = useState({})    
    const [unreachedTask, setUnreachedTask] = useState<Unreached[]>()
    const [selectedUnreachedTask, setSelectedUnreachedTask] = useState<SelectedUnreached[]>([])
    const clearValidationMessage = (): void => setValidationMessage({});


    async function fetchSectionPpl(section): Promise<void> {
        const res = await axios.post('draft/fetch-ppl', {section:section}).catch(error => error.response)
        if(res.status === 200) {
            setSectionPpl(res.data)
        }
    }
    
    async function registerDraft(draft): Promise<any> {
        setValidationMessage({});
        const params = new FormData();
        for(let i in draft) {
            if(draft.file !== undefined && i === 'file') {
                for(let j: number = 0;j<draft.file.length;j++) {
                    params.append(i+j, draft.file[j])
                }
                continue;
            }
            if(i === 'ppl') {
                for(let y: number = 0;y<draft.ppl.length;y++) {
                    let route: string = JSON.stringify(draft.ppl[y])
                    params.append('route[]', route)
                }
                continue;
            }
            params.append(i, draft[i])
        }
        const res = await axios.post('draft/register-draft', params,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).catch(error => error.response)
        if(res.status !== 200) {
            setValidationMessage(res.data.errors)
        }
        return res.status
    }

    async function fetchUnreachedTask(): Promise<void> {
        const res = await axios.get('draft/fetch-unreached-task').catch(error => error.response)
        setUnreachedTask(res.data)
    }

    async function fetchSelectedUnreachedTask(id): Promise<void> {
        const res = await axios.get(`draft/selected-unreached-task/${id}`).catch(error => error.response)
        // パラメータを直打ちして自分が関与していない案件にアクセスしようとした場合はNOT FOUNDを表示する
        if(res.data.length !== 0) {
            setSelectedUnreachedTask([res.data])
        } else {
            router.push('/404')
        }
    }

    const value = {
        fetchSectionPpl,
        registerDraft,
        clearValidationMessage,
        fetchUnreachedTask,
        fetchSelectedUnreachedTask,
        selectedUnreachedTask,
        unreachedTask,
        sectionPpl,
        validationMessage,
    }

    return <DraftContext.Provider value={value}>
                {children}
            </DraftContext.Provider>;
}


export default useDraft