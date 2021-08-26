import React from 'react';
import { useReturnedTask } from '../../hooks/useReturnedTask';
import TableContents from '../molecules/TableContents';
import Loading from '../atoms/Loading';

const ReturnedIndex = () => {
  const { isLoading, returnedTask } = useReturnedTask();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {returnedTask?.length > 0 ? (
            <TableContents
              tasks={returnedTask}
              th={['案件名', '返却者', '返却日時']}
              pathName={'returned'}
            />
          ) : (
            '案件はありません。'
          )}
        </div>
      )}
    </>
  );
};

export default ReturnedIndex;
