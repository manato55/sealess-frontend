import { repository } from '../axios/repository';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { http, authErrorMessage } from '../store/atom';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { fetcher } from '../axios/fetcher';
import { useCallback } from 'react';
import { progressRepo } from '../axios/progressRepo';
import { draftRepo } from '../axios/draftRepo';

type Task = {
  user: {
    section: string;
    name: string;
  };
  title: string;
  updated_at: string;
  id: number;
};

export type Unreached = {
  id: number;
  title: string;
  user: {
    name: string;
  };
  created_at: string;
};

export type TaskDetail = {
  content: string;
  title: string;
  filename: string;
};

export const useUnreachedTask = () => {
  const { data, error } = useSWR<[Unreached]>('draft/fetch-unreached-task', fetcher);

  return {
    unreachedTask: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useFetchedUnreachedTaskDetail = (id) => {
  const { data, error } = useSWR<[TaskDetail]>(`progress/fetch-detail-task/${id}`, fetcher);

  return {
    unreachedTaskDetail: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useProgress = () => {
  const { data, error, mutate } = useSWR<[Task]>('progress/fetch-recieved', fetcher);

  const _actionInEscalation = useCallback(
    async (action, paramId) => {
      const info = {
        data: {
          action: action,
          id: paramId,
        },
      };
      const res = await progressRepo.actionInEscalation(info);
      if (!res.isFailure) mutate;
      return res;
    },
    [mutate]
  );

  const _returnToDrafter = useCallback(
    async (info) => {
      const res = await progressRepo.returnToDrafter(info);
      if (!res.isFailure) mutate;
      return res;
    },
    [mutate]
  );

  const _downloadFile = useCallback(async (data) => {
    const res = await progressRepo.downloadFile({ data: data });
    return res;
  }, []);

  return {
    actionInEscalation: _actionInEscalation,
    downloadFile: _downloadFile,
    returnToDrafter: _returnToDrafter,
    recievedTask: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};
