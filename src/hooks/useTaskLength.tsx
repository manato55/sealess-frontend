import useSWR from 'swr';
import axios from '../axios'



export const useGetTotalLengthOfTaskInProgress = () => {
    const { data, error } = useSWR('progress/get-total-length', taskLengthFetcher);
    return {
        taskInProgress: data ? data : null,
        isLoading: !error && !data,
        isError: error,
    };
};

const taskLengthFetcher = async () => {
    const res = await axios.get('progress/get-total-length').catch(error => error.responnse)

    return res.data;
};
