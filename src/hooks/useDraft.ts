import repository from '../axios/repository';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { http, userStatus, authErrorMessage, eachErrorFlag } from '../store/atom';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { ErrorFlag } from './useAuth';

export const useDraft = () => {
  const setHttpStatus = useSetRecoilState(http);
  const setUser = useSetRecoilState(userStatus);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);

  return {
    fetchSectionPpl: async (section) => {
      const res = await repository
        .post('draft/fetch-ppl', { section: section })
        .catch((error) => error.response);
      if (res.status === 200) {
        return res.data;
      } else {
        setHttpStatus(res.status);
      }
    },

    registerDraft: async (draft) => {
      setErrorFlag({ ...errorFlag, file: false, title: false, content: false, route: false });
      const params = new FormData();
      for (let i in draft) {
        if (draft.file !== undefined && i === 'file') {
          for (let j = 0; j < draft.file.length; j++) {
            params.append(i + j, draft.file[j]);
          }
          continue;
        }
        if (i === 'ppl') {
          for (let y = 0; y < draft.ppl.length; y++) {
            let route: string = JSON.stringify(draft.ppl[y]);
            params.append('route[]', route);
          }
          continue;
        }
        params.append(i, draft[i]);
      }
      const res = await repository
        .post('draft/register-draft', params, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .catch((error) => error.response);

      if (res.status === 422) {
        setErrorMessage(res.data.errors);
        const tmp: ErrorFlag = {
          title: false,
          content: false,
          route: false,
          file: false,
        };
        const Arr = ['title', 'content', 'route'];
        for (let i of Arr) {
          if (res.data.errors[i]) {
            tmp[i] = true;
          }
        }
        let keys: string[] = Object.keys(res.data.errors);
        let fileExtracted: string[] = keys.filter((v) => v.match(/file/));
        if (fileExtracted.length > 0) {
          tmp.file = true;
        }
        setErrorFlag({
          ...errorFlag,
          file: tmp.file,
          title: tmp.title,
          content: tmp.content,
          route: tmp.route,
        });
      } else if (res.status === 200) {
        toast.success('登録しました。');
      } else {
        setHttpStatus(res.status);
      }
    },

    fetchSelectedUnreachedTask: async (id) => {
      const res = await repository
        .get(`draft/selected-unreached-task/${id}`)
        .catch((error) => error.response);
      // パラメータを直打ちして自分が関与していない案件にアクセスしようとした場合はNOT FOUNDを表示する
      if (res.status === 200) {
        if (res.data === '') {
          setHttpStatus(404);
        } else {
          return [res.data];
        }
      } else {
        setHttpStatus(res.status);
      }
    },

    searchTask: async (data, offset) => {
      setErrorMessage({ ...errorMessage, general: false });
      const res = await repository
        .post('draft/search-task', { data, offset })
        .catch((error) => error.response);
      if (res.status === 422) {
        setErrorMessage({ ...errorMessage, general: res.data.error });
      } else if (res.status === 200) {
        return res.data;
      } else {
        setHttpStatus(res.status);
      }
    },
  };
};
