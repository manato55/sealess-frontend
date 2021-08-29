import useSWR from 'swr';
import { fetcher } from '../axios/fetcher';

export const useGetTotalLengthOfTaskInProgress = () => {
  const { data, error } = useSWR('progress/get-total-length', fetcher);

  return {
    taskInProgress: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useTaskInProgress = (offset) => {
  const { data, error } = useSWR(`progress/fetch-in-progress/${offset}`, fetcher);

  return {
    paginatedTaskInProgress: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};
