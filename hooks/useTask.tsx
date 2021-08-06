import useSWR from 'swr';
import axios from '../axios'


export const useTask = (offset) => {
    const { data, error } = useSWR(offset, taskFetcher);
    return {
        paginatedTaskInProgress: data ? data : null,
        isLoading: !error && !data,
        isError: error,
    };
};

const taskFetcher = async (offset) => {
    const res = await axios.get(`progress/fetch-in-progress/${offset}`).catch(error => error.responnse)

    return res.data;
};

