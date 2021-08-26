import repository from '../axios/repository';
import { useSetRecoilState } from 'recoil';
import { http } from '../store/atom';
import { useRouter } from 'next/router';
import useSWR from 'swr';

export const useComplete = () => {
  const setHttpStatus = useSetRecoilState(http);
  const router = useRouter();

  return {
    fetchCompletedTask: async (choice) => {
      const res = await repository
        .get(`completed/fetch-task/${choice}`)
        .catch((error) => error.response);
      if (res.status === 200) {
        return res.data;
      } else {
        setHttpStatus(res.status);
      }
    },

    fetchCompletetTaskDetail: async (id) => {
      const res = await repository
        .get(`completed/fetch-detail-task/${id}`)
        .catch((error) => error.responnse);
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

    discardTask: async (id) => {
      const res = await repository
        .post('completed/discard-task', { id: id })
        .catch((error) => error.response);
      if (res.status === 200) {
        router.push('/history');
      } else {
        setHttpStatus(res.status);
      }
    },
  };
};
