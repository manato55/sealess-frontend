import useSWR from 'swr';
import axios from '../axios'
import { useSetRecoilState } from 'recoil'
import { http, userStatus } from '../store/atom'


interface Task {
    user: {
        section: string;
        name: string;
    }
    title: string;
    updated_at: string;
    id: number;
}


interface Unreached {
    id: number;
    title: string;
    user: {
        name: string;
    };
    created_at: string;
}


export const useSWRFunc = () => {
    const { data, error } = useSWR<[Task]>('progress/fetch-recieved', fetchRecievedTask);
    
    return {
        recievedTask: data ? data : null,
        isLoading: !error && !data,
        isError: error,
    };
};

async function fetchRecievedTask<T>(): Promise<T> {
    const res = await axios.get('progress/fetch-recieved').catch(error => error.response);
    return res.data;
}


export const useFiscalYear = () => {
    const { data, error } = useSWR<[number]>('draft/get-fiscal-year', getFiscalYear);

    return {
        fiscalYear: data ? data : null,
        isLoading: !error && !data,
        isError: error,
    };
}

async function getFiscalYear<T>(): Promise<T> {
    const res = await axios.get('draft/get-fiscal-year').catch(error => error.response);
    return res.data;
}

export const useUnreachedTask = () => {
    const { data, error } = useSWR<[Unreached]>('draft/fetch-unreached-task', fetchUnreachedTask);

    return {
        unreachedTask: data ? data : null,
        isLoading: !error && !data,
        isError: error,
    };
}

async function fetchUnreachedTask<T>(): Promise<T> {
    const res = await axios.get('draft/fetch-unreached-task').catch(error => error.response);
    return res.data;
}
