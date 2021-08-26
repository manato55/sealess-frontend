import repository from '../axios/repository';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { http, userStatus, authErrorMessage, eachErrorFlag, searchKeyword } from '../store/atom';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { toast } from 'react-toastify';

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

type LoginUser = {
  email: string;
  password: string;
};

export const useAuthenticate = () => {
  const setHttpStatus = useSetRecoilState(http);
  const setUser = useSetRecoilState(userStatus);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const [keyword, setKeyword] = useRecoilState(searchKeyword);

  return {
    login: async (user: LoginUser) => {
      setErrorMessage({ ...errorMessage, general: null });
      const res = await repository.post('login', user).catch((error) => error.response);
      if (res.status === 200) {
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        // user種別に応じて遷移先を変更
        switch (res.data.user.user_type) {
          case (0):
            router.push('/admin');
            break;
          case (1):
            router.push('/dep-admin');
            break;
          case (2):
            router.push('/');
            break;
          case (99):
            router.push('/owner');
            break;
        }
      } else if (res.status === 422) {
        setErrorMessage({ ...errorMessage, general: res.data.errors.message });
      } else {
        setHttpStatus(res.status);
      }
    },

    logout: async () => {
      if (!confirm('ログアウトしますか？')) {
        return;
      }
      const res = await repository.post('logout').catch((error) => error.response);
      if (res.status === 200) {
        await setUser(undefined);
        localStorage.removeItem('token');
        // 検索キーワード削除
        setKeyword({ ...keyword, task: null, name: null, year: null });
        router.push('/login');
      } else {
        setHttpStatus(res.status);
      }
    },

    registerDepAdmin: async (depUser) => {
      setErrorFlag({ ...errorFlag, name: false, department: false, email: false, password: false });
      const res = await repository
        .post('register-dep-admin', depUser)
        .catch((error) => error.response);
      if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const tmp: ErrorFlag = {
          name: false,
          email: false,
          password: false,
          department: false,
        };
        const Arr = ['name', 'email', 'password', 'department'];
        for (let i of Arr) {
          if (res.data.errors[i]) {
            tmp[i] = true;
          }
        }
        setErrorFlag({
          ...errorFlag,
          department: tmp.department,
          name: tmp.name,
          password: tmp.password,
          email: tmp.email,
        });
      } else if (res.status === 200) {
        toast.success('登録しました。');
      } else {
        setHttpStatus(res.status);
      }
    },

    registerOrdinaryUser: async (secUser) => {
      setErrorFlag({ ...errorFlag, name: false, section: false, email: false, jobTitle: false });
      const res = await repository
        .post('send-register-email', secUser)
        .catch((error) => error.response);
      if (res.status === 200) {
        toast.success('招待メールを送信しました。');
      } else if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const tmp: ErrorFlag = {
          name: false,
          email: false,
          section: false,
          jobTitle: false,
        };
        const Arr = ['name', 'email', 'section', 'jobTitle'];
        for (let i of Arr) {
          if (res.data.errors[i]) {
            tmp[i] = true;
          }
        }
        setErrorFlag({
          ...errorFlag,
          jobTitle: tmp.jobTitle,
          name: tmp.name,
          section: tmp.section,
          email: tmp.email,
        });
      } else {
        setHttpStatus(res.status);
      }
    },

    tokenCheck: async (token) => {
      const res = await repository.get(`token-check/${token}`).catch((error) => error.response);
      if (res.data === '') {
        setHttpStatus(404);
      } else {
        if (res.status === 200) {
          return res.data;
        } else {
          setHttpStatus(res.status);
        }
      }
    },

    adminTokenCheck: async (token) => {
      const res = await repository
        .get(`admin-token-check/${token}`)
        .catch((error) => error.response);
      if (res.data === '') {
        setHttpStatus(404);
      } else {
        if (res.status === 200) {
          return res.data;
        } else {
          setHttpStatus(res.status);
        }
      }
    },

    officialRegistryForOrdinaryUser: async (data) => {
      setErrorFlag({ ...errorFlag, password: false });
      const res = await repository.post('official-registry', data).catch((error) => error.response);
      if (res.status === 200) {
        router.push('/login');
        toast.success('登録完了');
      } else if (res.status === 422) {
        setErrorMessage(res.data.errors);
        setErrorFlag({ ...errorFlag, password: true });
      } else {
        setHttpStatus(res.status);
      }
    },

    passwordReRegister: async (email) => {
      setErrorFlag({ ...errorFlag, email: false });
      const res = await repository
        .post('re-password', { email: email })
        .catch((error) => error.response);
      if (res.status === 422) {
        setErrorMessage(res.data.email);
        setErrorFlag({ ...errorFlag, email: true });
      } else if (res.status === 200) {
        return res.status;
      } else {
        setHttpStatus(res.status);
      }
    },

    passwordTokenCheck: async (token) => {
      const res = await repository
        .get(`password-token-check/${token}`)
        .catch((error) => error.response);
      if (res.data === '') {
        setHttpStatus(404);
      } else {
        if (res.status === 200) {
          return res.data;
        } else {
          setHttpStatus(res.status);
        }
      }
    },

    reRegisterPassword: async (data) => {
      setErrorFlag({ ...errorFlag, password: false });
      const res = await repository
        .post('re-register-password', data)
        .catch((error) => error.response);
      if (res.status === 422) {
        setErrorMessage(res.data.errors);
        setErrorFlag({ ...errorFlag, password: true });
      } else if (res.status === 200) {
        router.push('/login');
        toast.success('登録完了');
      } else {
        setHttpStatus(res.status);
      }
    },

    editOrdinaryUserInfo: async (userInfo) => {
      setErrorFlag({ ...errorFlag, name: false, email: false });
      const res = await repository
        .post('edit-dep-user-info', userInfo)
        .catch((error) => error.response);
      if (res.status === 200) {
        toast.success('登録しました。');
      } else if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isName = res.data.errors.name ? true : false;
        const isEmail = res.data.errors.email ? true : false;
        setErrorFlag({...errorFlag, name: isName, email: isEmail});
      } else {
        setHttpStatus(res.status);
      }
    },

    deleteDepUser: async (userid) => {
      if (!confirm('削除しますか？')) {
        return;
      }
      const res = await repository
        .delete(`delete-dep-user/${userid}`)
        .catch((error) => error.response);
      if (res.status === 200) {
        toast.success('削除しました。');
        router.push('/dep-admin/users');
      } else {
        setHttpStatus(res.status);
      }
    },

    deleteDepAdminUser: async (userid) => {
      if (!confirm('削除しますか？')) {
        return;
      }
      const res = await repository
        .delete(`delete-dep-admin-user/${userid}`)
        .catch((error) => error.response);
      if (res.status === 200) {
        toast.success('削除しました。');
        router.push('/admin/dep-admin-user');
      } else {
        setHttpStatus(res.status);
      }
    },

    changeDepartment: async (userInfo) => {
      setErrorFlag({ ...errorFlag, department: false, section: false });
      const res = await repository
        .post('change-department', userInfo)
        .catch((error) => error.response);
      if (res.status === 200) {
        router.push('/admin/all-users');
        toast.success('登録完了');
      } else if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isDep = res.data.errors.department ? true : false;
        const isSection = res.data.errors.section ? true : false;
        setErrorFlag({...errorFlag, department: isDep, section: isSection});
      } else {
        setHttpStatus(res.status);
      }
    },

    changeDepAdminInfo: async (userInfo) => {
      setErrorFlag({ ...errorFlag, name: false, email: false });
      const res = await repository
        .post('change-dep-admin-info', userInfo)
        .catch((error) => error.response);
      if (res.status === 200) {
        router.push('/admin/dep-admin-user');
        toast.success('登録完了');
      } else if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isName = res.data.errors.name ? true : false;
        const isEmail = res.data.errors.email ? true : false;
        setErrorFlag({...errorFlag, name: isName, email: isEmail});
      } else {
        setHttpStatus(res.status);
      }
    },

    registerCompany: async (info) => {
      setErrorFlag({ ...errorFlag, name: false, email: false });
      const res = await repository
        .post('company/register-company', info)
        .catch((error) => error.response);
      if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isName = res.data.errors.name ? true : false;
        const isEmail = res.data.errors.email ? true : false;
        setErrorFlag({...errorFlag, name: isName, email: isEmail});
      } else if (res.status === 200) {
        toast.success('登録完了');
      } else {
        setHttpStatus(res.status);
      }
    },

    officialRegistryForAdmin: async (info) => {
      setErrorFlag({ ...errorFlag, name: false, password: false });
      const res = await repository
        .post('official-admin-registry', info)
        .catch((error) => error.response);
      if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isName = res.data.errors.name ? true : false;
        const isPassword = res.data.errors.password ? true : false;
        setErrorFlag({...errorFlag, name: isName, password: isPassword});
      } else if (res.status === 200) {
        toast.success('登録完了');
        router.push('/login');
      } else {
        setHttpStatus(res.status);
      }
    },

    departmentRegistry: async (info) => {
      setErrorFlag({ ...errorFlag, name: false });
      const res = await repository
        .post('department-registry', info)
        .catch((error) => error.response);
      if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isName = res.data.errors.name ? true : false;
        setErrorFlag({...errorFlag, name: isName,});
      } else if (res.status === 201) {
        toast.success('登録完了');
      } else {
        setHttpStatus(res.status);
      }
    },

    sectionRegistry: async (info) => {
      setErrorFlag({ ...errorFlag, name: false, department: false });
      const res = await repository.post('section-registry', info).catch((error) => error.response);
      if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isName = res.data.errors.name ? true : false;
        const isDep = res.data.errors.department ? true : false;
        setErrorFlag({ ...errorFlag, name: isName, department: isDep });
      } else if (res.status === 201) {
        toast.success('登録完了');
      } else {
        setHttpStatus(res.status);
      }
    },

    jobTitleRegistry: async (info) => {
      setErrorFlag({ ...errorFlag, name: false });
      const res = await repository.post('job-title-registry', info).catch((error) => error.response);
      if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isName = res.data.errors.name ? true : false;
        setErrorFlag({ ...errorFlag, name: isName });
      } else if (res.status === 201) {
        toast.success('登録完了');
      } else {
        setHttpStatus(res.status);
      }
    },

    deleteThisDep: async (id) => {
      setErrorMessage({ ...errorMessage, general: null });
      if (!confirm('削除しますか？')) {
        return;
      }
      const res = await repository
        .delete(`delete-dep/${id}`)
        .catch((error) => error.response);
      if (res.status === 200) {
        toast.success('削除しました。');
        router.push('/admin/dep-index');
      } else if(res.status === 422) {
        setErrorMessage({ ...errorMessage, general: res.data.error });
      } else {
        setHttpStatus(res.status);
      }
    },

    deleteThisSec: async (id) => {
      setErrorMessage({ ...errorMessage, general: null });
      if (!confirm('削除しますか？')) {
        return;
      }
      const res = await repository
        .delete(`company/delete-sec/${id}`)
        .catch((error) => error.response);
      if (res.status === 200) {
        toast.success('削除しました。');
        router.push('/admin/dep-index');
      } else if(res.status === 422) {
        setErrorMessage({ ...errorMessage, general: res.data.error });
      } else {
        setHttpStatus(res.status);
      }
    },

    changeDepName: async (info) => {
      setErrorFlag({ ...errorFlag, name: false });
      const res = await repository
        .post('company/change-dep-info', info)
        .catch((error) => error.response);
      if (res.status === 200) {
        router.push('/admin/dep-index');
        toast.success('登録完了');
      } else if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isName = res.data.errors.name ? true : false;
        setErrorFlag({...errorFlag, name: isName });
      } else {
        setHttpStatus(res.status);
      }
    },

    changeSecName: async (info) => {
      setErrorFlag({ ...errorFlag, name: false });
      const res = await repository
        .post('company/change-sec-info', info)
        .catch((error) => error.response);
      if (res.status === 200) {
        router.push('/admin/dep-index');
        toast.success('登録完了');
      } else if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const isName = res.data.errors.name ? true : false;
        setErrorFlag({...errorFlag, name: isName });
      } else {
        setHttpStatus(res.status);
      }
    },

  };
};
