import useSWR from 'swr';
import { fetcher } from '../axios/fetcher';
import { useSetRecoilState } from 'recoil'
import { http, userStatus } from '../store/atom'

interface Task {
    id: number;
    title:string;
    returned_task: {
        user_id: number;
        user: {
            section: string;
            name: string;
        }
    }
    updated_at: string;
    user_id: number;
}

export const useReturnedTask = () => {
    const setHttpStatus = useSetRecoilState(http)
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
    };
};
