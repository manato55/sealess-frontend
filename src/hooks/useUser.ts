import repository from '../axios/repository';
import useSWR from 'swr';
import { useRecoilValue } from 'recoil';
import { departmentSelection } from '../store/atom';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  department?: {
    id: number;
  }
  section?: string;
}

export interface DepSecIndex {
  id: number;
  name: string;
  sections: {
    id: number;
    name: string;
  }[]
}

export const useUser = () => {
  const { data, error } = useSWR('fetch-dep-users', fetcher);

  return {
    depUser: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useDepSecIndex = () => {
  const { data, error } = useSWR<[DepSecIndex]>('fetch-dep-sec', fetcher);

  return {
    depSecIndex: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useDepUser = () => {
  const { data, error } = useSWR<[AdminUser]>('fetch-admin-users', fetcher);

  return {
    adminUser: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useNormalUser = () => {
  const department = useRecoilValue(departmentSelection);
  const { data, error } = useSWR<[AdminUser]>(`fetch-normal-users/${department}`, fetcher);

  return {
    normalUser: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

async function fetcher<T>(path): Promise<T> {
  const res = await repository.get(path).catch((error) => error.responnse);

  return res.data;
};
