import useSWR from 'swr';
import { fetcher } from '../axios/fetcher';
import { useCallback } from 'react';
import { companyInfoRepo } from '../axios/companyInfoRepo';

export type AdminUser = {
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
};

export type DepSecIndex = {
  id: number;
  name: string;
  sections: {
    id: number;
    name: string;
  }[];
};

export type PersonalTitle = {
  id: number;
  name: string;
};

export const useDepartment = () => {
  const { data, error } = useSWR<[PersonalTitle]>('fetch-department', fetcher);

  return {
    fetchedDepartment: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useFetchDepartmentUser = () => {
  const { data, error, mutate } = useSWR<[AdminUser]>('fetch-dep-users', fetcher);

  const _editNormalUserInfo = useCallback(
    async (Info) => {
      const res = await companyInfoRepo.editNormalUserInfo(Info);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  return {
    editNormalUserInfo: _editNormalUserInfo,
    depUser: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useDepSecIndex = () => {
  const { data, error, mutate } = useSWR<[DepSecIndex]>('fetch-dep-sec', fetcher);

  const _changeSecName = useCallback(
    async (info) => {
      const res = await companyInfoRepo.changeSecName(info);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  const _registerDepAdmin = useCallback(async (depUser) => {
    const res = await companyInfoRepo.registerDepAdmin(depUser);
    return res;
  }, []);

  const _deleteThisDep = useCallback(
    async (id) => {
      const res = await companyInfoRepo.deleteDepartment(id).catch((error) => error.response);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  const _deleteThisSec = useCallback(
    async (id) => {
      const res = await companyInfoRepo.deleteSection(id).catch((error) => error.response);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  return {
    changeSecName: _changeSecName,
    registerDepAdmin: _registerDepAdmin,
    deleteThisDep: _deleteThisDep,
    deleteThisSec: _deleteThisSec,
    depSecIndex: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useDepUser = () => {
  const { data, error, mutate } = useSWR<[AdminUser]>('fetch-admin-users', fetcher);

  const _changeDepAdminInfo = useCallback(
    async (info) => {
      const res = await companyInfoRepo.changeDepAdminDepartment(info);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  return {
    changeDepAdminInfo: _changeDepAdminInfo,
    adminUser: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useUpdateCompanyInfo = (id?) => {
  const { data, error, mutate } = useSWR<[AdminUser]>(`fetch-normal-users/${id}`, fetcher);

  const _changeDepartment = useCallback(
    async (info) => {
      const res = await companyInfoRepo.changeDepartment(info);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  const _changeDepName = useCallback(
    async (info) => {
      const res = await companyInfoRepo.changeDepName(info);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  return {
    changeDepartment: _changeDepartment,
    changeDepName: _changeDepName,
    normalUser: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useJobTitle = () => {
  const { data, error, mutate } = useSWR<[PersonalTitle]>('company/fetch-job-title', fetcher);

  const _changeJobTitle = useCallback(
    async (info) => {
      const res = await companyInfoRepo.changeJobTitle(info);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  const _deleteJobTitle = useCallback(
    async (id) => {
      const res = await companyInfoRepo.deleteJobTitle(id);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  return {
    changeJobTitle: _changeJobTitle,
    deleteJobTitle: _deleteJobTitle,
    fetchedJobTitle: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useSetionsByDepartmentId = (id) => {
  const { data, error } = useSWR<[PersonalTitle]>(`company/fetch-sections/${id}`, fetcher);

  return {
    fetchedSections: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useDepAdmin = () => {
  const _inviteNormalUser = useCallback(async (info) => {
    const res = await companyInfoRepo.inviteNormalUser(info);
    return res;
  }, []);

  return {
    inviteNormalUser: _inviteNormalUser,
  };
};
