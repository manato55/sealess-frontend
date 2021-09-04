import { useSetRecoilState, useRecoilState } from 'recoil';
import { http, eachErrorFlag } from '../store/atom';
import useSWR from 'swr';
import { useCallback } from 'react';
import { draftRepo } from '../axios/draftRepo';
import { fetcher } from '../axios/fetcher';

export type SectionPpl = {
  id: number;
  name: string;
};

export const useFiscalYear = () => {
  const { data, error } = useSWR<[number]>('draft/get-fiscal-year', fetcher);

  return {
    fiscalYear: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useDraft = () => {
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);

  const _registerDraft = useCallback(async (draft) => {
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
          const route = JSON.stringify(draft.ppl[y]);
          params.append('route[]', route);
        }
        continue;
      }
      params.append(i, draft[i]);
    }
    const res = await draftRepo.registerDraft(params);
    return res;
  }, []);

  const _searchTask = useCallback(async (data, offset) => {
    const res = await draftRepo.searchTask({ data, offset });
    return res;
  }, []);

  return {
    registerDraft: _registerDraft,
    searchTask: _searchTask,
  };
};

export const useFetchSelectedUnreachedTask = (id) => {
  const { data, error } = useSWR(`draft/selected-unreached-task/${id}`, fetcher);

  return {
    selectedUnreachedTask: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useFetchSectionPpl = (id) => {
  const { data, error } = useSWR<[SectionPpl]>(`draft/fetch-ppl/${id}`, fetcher);

  return {
    fetchedSectionPpl: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};
