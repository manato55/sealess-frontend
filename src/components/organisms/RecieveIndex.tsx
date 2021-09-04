import React from 'react';
import { useProgress } from '../../hooks/useProgress';
import TableContents from '../molecules/TableContents';
import Loading from '../atoms/Loading';

export const ReceiveIndex = (): React.ReactElement => {
  const { isLoading, recievedTask } = useProgress();

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
