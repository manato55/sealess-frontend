import useSWR from 'swr';
import { fetcher } from '../axios/fetcher';
import { useCallback } from 'react';
import { draftRepo } from '../axios/draftRepo';
import { routeRepo } from '../axios/routeRepo';

export const useFetchRegisteredRoute = () => {
  const { data, error, mutate } = useSWR('route/fetch-registered', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const _registerRoute = useCallback(
    async (route, label) => {
      const info = {
        data: {
          route: route,
          label: label,
        },
      };
      const res = await draftRepo.registerRoute(info);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  const _removeRegisteredRoute = useCallback(
    async (id) => {
      const res = await draftRepo.deleteRegisteredRoute(id);
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  return {
    registerRoute: _registerRoute,
    removeRegisteredRoute: _removeRegisteredRoute,
    registeredRoute: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useRouting = () => {
  const { data, error, mutate } = useSWR('route/fetch-agent-status', fetcher);

  const _registerAgentUser = useCallback(
    async (userId) => {
      const res = await routeRepo.registerAgentUser({ id: userId });
      if (!res.isFailure) mutate();
      return res;
    },
    [mutate]
  );

  const _agentStatus2False = useCallback(async () => {
    const res = await routeRepo.agentStatus2False();
    if (!res.isFailure) mutate();
    return res;
  }, [mutate]);

  const _agentStatus2True = useCallback(async () => {
    const res = await routeRepo.agentStatus2True();
    if (!res.isFailure) mutate();
    return res;
  }, [mutate]);

  return {
    registerAgentUser: _registerAgentUser,
    agentStatus2False: _agentStatus2False,
    agentStatus2True: _agentStatus2True,
    agentStatus: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
};
