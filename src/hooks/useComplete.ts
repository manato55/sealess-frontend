import useSWR from 'swr';
import { useCallback } from 'react';
import { draftRepo } from '../axios/draftRepo';
import { fetcher } from '../axios/fetcher';

type TaskDetail = {
  title: string;
  content: string;
  filename: string;
};

export type CompletedTask = {
  returned_task?: {
    user_id: number;
    user: {
      section: string;
      name: string;
    };
  };
  user_id?: number;
  title: string;
  id: number;
  updated_at?: string;
  user?: {
    section: string;
    name: string;
  };
  process?: string;
  created_at?: string;
};

export const useCompletedTask = (choice: string) => {
  const { data, error } = useSWR<[CompletedTask]>(`completed/fetch-task/${choice}`, fetcher);

  return {
    completedTask: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCompletedTaskDetail = (id?) => {
  const { data, error } = useSWR<[TaskDetail]>(`completed/fetch-detail-task/${id}`, fetcher);

  return {
    completedTaskDetail: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};
