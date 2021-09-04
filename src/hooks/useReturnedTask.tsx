import { repository } from '../axios/repository';
import useSWR from 'swr';
import { fetcher } from '../axios/fetcher';
import { useSetRecoilState } from 'recoil';
import { http } from '../store/atom';
import { useCallback } from 'react';
import { draftRepo } from '../axios/draftRepo';
import { progressRepo } from '../axios/progressRepo';

export type Task = {
  id: number;
  title: string;
  returned_task?: {
    user_id: number;
    user: {
      section: string;
      name: string;
    };
  };
  user_id?: number;
};

export type ReturnedDetail = {
  title: string;
  content: string;
  returned_task?: {
    comment: string;
  };
  process: string;
  filename: string;
  id: number;
  agent_statuses: {
    route: string;
    user: {
      name: string;
      id: number;
      department: string;
      section: string;
    };
    agent_user: number;
  }[];
};

export const useReturnedTaskDetail = (id) => {
  const { data, error } = useSWR<ReturnedDetail>(`returned/fetch-detail/${id}`, fetcher);

  return {
    returnedTaskDetail: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useReturnedTask = () => {
  const { data, error } = useSWR<[Task]>('returned/fetch-task', fetcher);

  const _discardReturnedTask = useCallback(async (id) => {
    const res = await draftRepo.deleteReturnedTask(id);
    return res;
  }, []);

  const _removeFile = useCallback(async (data) => {
    const res = await progressRepo.removeFile(data);
    return res;
  }, []);

  return {
    discardReturnedTask: _discardReturnedTask,
    removeFile: _removeFile,
    returnedTask: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};
