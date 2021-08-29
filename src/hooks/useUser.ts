import useSWR from 'swr';
import { useRecoilValue } from 'recoil';
import { departmentSelection } from '../store/atom';
import { fetcher } from '../axios/fetcher';
import repository from '../axios/repository';
import { useCallback } from 'react';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  department?: {
    id: number;
    name: string;
  };
  section?: {
    name: string;
    id: number;
  };
  job_title?: {
    name: string;
    id: number;
  };
}

export interface DepSecIndex {
  id: number;
  name: string;
  sections: {
    id: number;
    name: string;
  }[];
}

export interface JobTitle {
  id: number;
  name: string;
}

export interface Sections {
  id: number;
  name: string;
}

export const useUser = () => {
  const { data, error } = useSWR<[AdminUser]>('fetch-dep-users', fetcher);

  return {
    depUser: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useDepSecIndex = () => {
  const { data, error, mutate } = useSWR<[DepSecIndex]>('fetch-dep-sec', fetcher);

  const _changeSecName = useCallback(
    async (info) => {
      const res = await repository
        .post('company/change-sec-info', info)
        .catch((error) => error.response);
      if (res.status === 200) {
        mutate();
      }
      return res;
    },
    [mutate]
  );

  return {
    changeSecName: _changeSecName,
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
  const departmentId = useRecoilValue(departmentSelection);
  const { data, error, mutate } = useSWR<[AdminUser]>(
    `fetch-normal-users/${departmentId}`,
    fetcher
  );

  const _changeDepartment = useCallback(
    async (userInfo) => {
      const res = await repository
        .post('change-department', userInfo)
        .catch((error) => error.response);
      if (res.status === 200) {
        mutate();
      }
      return res;
    },
    [mutate]
  );

  return {
    changeDepartment: _changeDepartment,
    normalUser: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useJobTitle = () => {
  const { data, error, mutate } = useSWR<[JobTitle]>('company/fetch-job-title', fetcher);

  const _changeJobTitle = useCallback(
    async (info) => {
      const res = await repository
        .post('company/change-job-title', info)
        .catch((error) => error.response);
      if (res.status === 200) {
        mutate();
      }
      return res;
    },
    [mutate]
  );

  return {
    changeJobTitle: _changeJobTitle,
    fetchedJobTitle: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useSetionsByDepartmentId = (id) => {
  const { data, error } = useSWR<[Sections]>(`company/fetch-sections/${id}`, fetcher);

  return {
    fetchedSections: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};
