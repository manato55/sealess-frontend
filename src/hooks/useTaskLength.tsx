import useSWR from 'swr';
import repository from '../axios/repository'



export const useGetTotalLengthOfTaskInProgress = () => {
    const { data, error } = useSWR('progress/get-total-length', taskLengthFetcher);
    return {
        taskInProgress: data ? data : null,
        isLoading: !error && !data,
        isError: error,
    };
};

const taskLengthFetcher = async () => {
    const res = await repository.get('progress/get-total-length').catch(error => error.responnse)

    return res.data;
};
