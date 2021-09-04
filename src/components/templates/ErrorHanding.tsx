import React from 'react';
import { SWRConfig } from 'swr';
import { http } from '../../store/atom';
import { useSetRecoilState } from 'recoil';

const ErrorHanding = ({ children }) => {
  const setHttpStatus = useSetRecoilState(http);

  return (
    <>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          onError: (error) => {
            error && setHttpStatus(error.response.status);
          },
        }}
      >
        {children}
      </SWRConfig>
    </>
  );
};

export default ErrorHanding;
