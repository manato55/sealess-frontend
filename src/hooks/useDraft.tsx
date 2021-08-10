import { useContext, useState, createContext,useEffect } from 'react';
import axios from '../axios'
import { useSetRecoilState } from 'recoil'
import { http } from '../store/atom'

type SelectedUnreached = {
    title: string;
    content: string;
    filename: string;
}

type Task = {
    id: number;
    title: string;
    user: {
        name: string;
    }
    updated_at: string;
}[]

export const DraftContext = createContext({} as {
    fetchSectionPpl: (section: string) => void;
    registerDraft: (draft: object) => any;
    fetchSelectedUnreachedTask: (id: number) => void;
    clearValidationMessage: () => void;
    clearSearchedTask: () => void;
    clearInputError: () => void;
    searchTask: (data: object, offset:number) => void;
    sectionPpl: {
        name: string
        id: number
    }[];
    validationMessage: {
        title?: string;
        content?: string;
        route?: string;
    };
    selectedUnreachedTask: SelectedUnreached[];
    searchedTask: Task[];
    inputError: string[];
});

export const useDraft = () => {
    return useContext(DraftContext);
};

export const DraftProvider = ({children}) => {
    const [sectionPpl, setSectionPpl] = useState<{name:string,id:number}[]>([]);
    const [validationMessage, setValidationMessage] = useState({})    
    const [selectedUnreachedTask, setSelectedUnreachedTask] = useState<SelectedUnreached[]>([])
    const clearValidationMessage = (): void => setValidationMessage({});
    const [searchedTask, setSearchedTask] = useState<Task[]>()
    const [inputError, setInputError] = useState<string[]>()
    const setHttpStatus = useSetRecoilState(http)


    async function fetchSectionPpl(section): Promise<void> {
        const res = await axios.post('draft/fetch-ppl', {section:section}).catch(error => error.response)
        if(res.status === 200) {
            setSectionPpl(res.data)
        } else {
            setHttpStatus(res.status)
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
        if(res.status === 422) {
            setValidationMessage(res.data.errors)
        } else if(res.status !== 200) {
            setHttpStatus(res.status)
        }
    
        return res.status
    }

    async function fetchSelectedUnreachedTask(id): Promise<void> {
        const res = await axios.get(`draft/selected-unreached-task/${id}`).catch(error => error.response)
        // パラメータを直打ちして自分が関与していない案件にアクセスしようとした場合はNOT FOUNDを表示する
        if(res.data !== '') {
            setSelectedUnreachedTask([res.data])
        } else {
            setHttpStatus(404)
        }
    }

    async function searchTask(data,offset): Promise<void> {
        setInputError([])
        const res = await axios.post('draft/search-task',{data,offset}).catch(error => error.response)
        if(res.status === 422) {
            setInputError(res.data.error)
        } else if(res.status === 200) {
            setSearchedTask(res.data);
        } else {
            setHttpStatus(res.status)
        }
    }

    const clearSearchedTask = () => {
        setSearchedTask(undefined)
    }

    const clearInputError = () => {
        setInputError(undefined)
    }

    const value = {
        fetchSectionPpl,
        registerDraft,
        clearValidationMessage,
        fetchSelectedUnreachedTask,
        searchTask,
        clearSearchedTask,
        clearInputError,
        inputError,
        searchedTask,
        selectedUnreachedTask,
        sectionPpl,
        validationMessage,
    }

    return <DraftContext.Provider value={value}>
                {children}
            </DraftContext.Provider>;
}


export default useDraft