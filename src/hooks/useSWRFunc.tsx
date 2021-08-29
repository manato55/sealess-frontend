import useSWR from 'swr';
import { fetcher } from '../axios/fetcher';

interface Task {
  user: {
    section: string;
    name: string;
  };
  title: string;
  updated_at: string;
  id: number;
}

export interface Unreached {
  id: number;
  title: string;
  user: {
    name: string;
  };
  created_at: string;
}

export interface Department {
  name: string;
  id: number;
}

export const useSWRFunc = () => {
  const { data, error } = useSWR<[Task]>('progress/fetch-recieved', fetcher);

  return {
    recievedTask: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useFiscalYear = () => {
  const { data, error } = useSWR<[number]>('draft/get-fiscal-year', fetcher);

  return {
    fiscalYear: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useUnreachedTask = () => {
  const { data, error } = useSWR<[Unreached]>('draft/fetch-unreached-task', fetcher);

  return {
    unreachedTask: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useDepartment = () => {
  const { data, error } = useSWR<[Department]>('fetch-department', fetcher);

  return {
    fetchedDepartment: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};
