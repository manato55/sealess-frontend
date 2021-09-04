import { useCallback } from 'react';
import useSWR from 'swr';
import { fetcher } from '../axios/fetcher';
import { progressRepo } from '../axios/progressRepo';

export const useGetTotalLengthOfTaskInProgress = () => {
  const { data, error, mutate } = useSWR('progress/get-total-length', fetcher);

  const _actionInProgress = useCallback(
    async (action, paramId) => {
      const info = {
        data: {
          action: action,
          id: paramId,
        },
      };
      const res = await progressRepo.actionInProgress(info);
      if (!res.isFailure) mutate;
      return res;
    },
    [mutate]
  );

  return {
    actionInProgress: _actionInProgress,
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
