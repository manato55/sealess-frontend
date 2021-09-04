import { repository } from '../axios/repository';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { http, userStatus, authErrorMessage, eachErrorFlag, searchKeyword } from '../store/atom';
import router, { useRouter } from 'next/router';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { fetcher } from '../axios/fetcher';
import { authenticateRepo } from '../axios/authenticateRepo';
import { useCallback } from 'react';
import { companyInfoRepo } from '../axios/companyInfoRepo';

export type ErrorFlag = {
  name?: boolean;
  email?: boolean;
  password?: boolean;
  department?: boolean;
  section?: boolean;
  jobTitle?: boolean;
  content?: boolean;
  route?: boolean;
  title?: boolean;
  file?: boolean;
};

export type User = {
  email: string;
  password: string;
};

export type LoginUser = {
  user: {
    user_type: number;
    email: string;
    password: string;
  };
  token: string;
};

export const useLoginCheck = () => {
  const _login = useCallback(async (user: User) => {
    const res = await authenticateRepo.login(user);
    return res;
  }, []);

  const _logout = useCallback(async () => {
    const res = await authenticateRepo.logout();
    return res;
  }, []);

  return {
    login: _login,
    logout: _logout,
  };
};

export const useTokenCheck = (token: string | string[]) => {
  const { data, error } = useSWR<boolean>(`token-check/${token}`, fetcher);

  return {
    tokenChecker: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useAdminTokenCheck = (token: string | string[]) => {
  const { data, error } = useSWR<boolean>(`admin-token-check/${token}`, fetcher);

  return {
    adminTokenChecker: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const usePwTokenCheck = (token: string | string[]) => {
  const { data, error } = useSWR<boolean>(`password-token-check/${token}`, fetcher);

  const _reRegisterPassword = useCallback(async (info) => {
    const res = await companyInfoRepo.reRegisterPassword(info);
    return res;
  }, []);

  return {
    reRegisterPassword: _reRegisterPassword,
    passwordTokenChecker: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useAuthenticate = () => {
  const _officialRegistryForNormalUser = useCallback(async (data) => {
    const res = await companyInfoRepo.officialRegistryForNormalUser(data);
    return res;
  }, []);

  const _deleteNormalUser = useCallback(async (userid) => {
    const res = await companyInfoRepo.deleteNormalUser(userid);
    return res;
  }, []);

  const _passwordIssuanceMail = useCallback(async (email) => {
    const res = await companyInfoRepo.passwordIssuanceMail({ email: email });
    return res;
  }, []);

  const _registerCompany = useCallback(async (info) => {
    const res = await companyInfoRepo.registerCompany(info);
    return res;
  }, []);

  const _officialRegistryForAdmin = useCallback(async (info) => {
    const res = await companyInfoRepo.adminRegistry(info);
    return res;
  }, []);

  const _deleteDepAdminUser = useCallback(async (id) => {
    const res = await companyInfoRepo.deleteDepAdmin(id);
    return res;
  }, []);

  const _departmentRegistry = useCallback(async (info) => {
    const res = await companyInfoRepo.departmentRegistry(info);
    return res;
  }, []);

  const _sectionRegistry = useCallback(async (info) => {
    const res = await companyInfoRepo.sectionRegistry(info);
    return res;
  }, []);

  const _jobTitleRegistry = useCallback(async (info) => {
    const res = await companyInfoRepo.jobTitleRegistry(info);
    return res;
  }, []);

  return {
    officialRegistryForNormalUser: _officialRegistryForNormalUser,
    deleteNormalUser: _deleteNormalUser,
    passwordIssuanceMail: _passwordIssuanceMail,
    registerCompany: _registerCompany,
    officialRegistryForAdmin: _officialRegistryForAdmin,
    deleteDepAdminUser: _deleteDepAdminUser,
    departmentRegistry: _departmentRegistry,
    sectionRegistry: _sectionRegistry,
    jobTitleRegistry: _jobTitleRegistry,
  };
};
