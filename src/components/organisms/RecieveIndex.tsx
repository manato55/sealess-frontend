import React from 'react';
import { useSWRFunc } from '../../hooks/useSWRFunc';
import TableContents from '../molecules/TableContents';
import Loading from '../atoms/Loading';

export const ReceiveIndex = (): React.ReactElement => {
  const { isLoading, recievedTask } = useSWRFunc();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : recievedTask?.length > 0 ? (
        <TableContents
          tasks={recievedTask}
          th={['案件名', '起案者', '受信日時']}
          pathName={'recieve'}
        />
      ) : (
        '案件はありません。'
      )}
    </>
  );
};

export default ReceiveIndex;
