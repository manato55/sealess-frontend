import repository from '../axios/repository';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { http, authErrorMessage } from '../store/atom';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { saveAs } from 'file-saver';

export const useProgress = (offset?) => {
  const setHttpStatus = useSetRecoilState(http);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);

  const { data, error } = useSWR(offset, taskFetcher);

  return {
    paginatedTaskInProgress: data ? data : null,
    isLoading: !error && !data,
    isError: error,

    fetchSelectedTask: async (id) => {
      const res = await repository.get(`progress/fetch-detail-task/${id}`).catch((error) => error.responnse);
      if (res.data.length === 0) {
        setHttpStatus(404);
      } else {
        if (res.status === 200) {
          return res.data;
        } else {
          setHttpStatus(res.status);
        }
      }
    },

    actionInProgress: async (action, paramId) => {
      const res = await repository
        .post('progress/action-inprogress', {
          data: {
            action: action,
            id: paramId,
          },
        })
        .catch((error) => error.response);
      const initialPage = 1;
      if (res.status === 200) {
        router.push(`/progress/index/${initialPage}`);
      } else {
        setHttpStatus(res.status);
      }
    },

    actionInEscalation: async (action, paramId) => {
      const res = await repository
        .post('progress/action-inescalation', {
          data: {
            action: action,
            id: paramId,
          },
        })
        .catch((error) => error.response);
      if (res.status === 200) {
        router.push('/recieve');
      } else {
        setHttpStatus(res.status);
      }
    },

    returnToDrafter: async (data) => {
      setErrorMessage({ ...errorMessage, general: false });
      const res = await repository.post('progress/return', data).catch((error) => error.response);
      if (res.status === 200) {
        router.push('/recieve');
      } else if (res.status === 422) {
        setErrorMessage({ ...errorMessage, general: res.data.error.comment });
      } else {
        setHttpStatus(res.status);
      }
    },

    downloadFile: async (data) => {
      const res = await repository
        .post('progress/fetch-file', { data: data }, { responseType: 'blob' })
        .catch((error) => error.response);
      const blob = new Blob([res.data], {
        type: res.data.type,
      });
      const contentDisposition = res.headers['content-disposition'];
      const fileName = contentDisposition.substring(contentDisposition.indexOf('=') + 1);
      saveAs(blob, fileName);
    },

    fetchTaskInProgress: async (offset) => {
      const res = await repository.get(`progress/fetch-in-progress/${offset}`).catch((error) => error.responnse);
      if (res.status !== 200) {
        setHttpStatus(res.status);
      }
    },
  };
};

const taskFetcher = async (offset) => {
  const res = await repository.get(`progress/fetch-in-progress/${offset}`).catch((error) => error.responnse);

  return res.data;
};
