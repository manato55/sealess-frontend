import React from 'react';
import { useReturnedTask } from '../../hooks/useReturnedTask';
import TableContents from '../../components/molecules/TableContents';

export const Returned = (): React.ReactElement => {
  const { isLoading, returnedTask } = useReturnedTask();

  return (
    <>
      {isLoading ? (
        <p>Loding...</p>
      ) : (
        <div>
          {returnedTask?.length > 0 ? (
            <TableContents tasks={returnedTask} th={['案件名', '返却者', '返却日時']} pathName={'returned'} />
          ) : (
            '案件はありません。'
          )}
        </div>
      )}
    </>
  );
};

export default Returned;
