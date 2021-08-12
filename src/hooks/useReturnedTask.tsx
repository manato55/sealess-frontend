import repository from '../axios/repository'
import useSWR from 'swr';
import { fetcher } from '../axios/fetcher';
import { useSetRecoilState } from 'recoil'
import { http } from '../store/atom'
import {useRouter} from 'next/router'


export interface Task {
    id: number;
    title:string;
    returned_task?: {
        user_id: number;
        user: {
            section: string;
            name: string;
        }
    }
    user_id?: number;
}

export const useReturnedTask = () => {
    const setHttpStatus = useSetRecoilState(http)
    const router = useRouter()

    const { data, error } = useSWR<[Task]>('returned/fetch-task', fetcher,{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    },);
    
    if(error) {
        setHttpStatus(500)
    }
    
    return {
        returnedTask: data ? data : null,
        isLoading: !error && !data,
        isError: error,

        fetchReturnedDetail: async(id) => {
            const res = await repository.get(`returned/fetch-detail/${id}`).catch(error => error.response)
            if(res.status === 200) {
                return res.data
            } else {
                setHttpStatus(res.status)
            }
        },

        removeFile: async(data) => {
            const res = await repository.post('returned/remove-file',data).catch(error => error.response); 
            if(res.status === 200) {
                return true
            } else {
                setHttpStatus(res.status)
            }
        },

        discardReturnedTask: async(id) => {
            const res = await repository.post('returned/remove-task',{id:id}).catch(error => error.response); 
            if(res.status === 200) {
                router.push('/returned')
            } else {
                setHttpStatus(res.status)
            }
        }


    };
};
