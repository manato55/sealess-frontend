import React, { useCallback } from 'react';
import { useProgress } from '../../../hooks/useProgress';
import { useGetTotalLengthOfTaskInProgress } from '../../../hooks/useTaskLength';
import { useRouter } from 'next/router';
import Paginate from '../../../components/molecules/Paginate';
import TableContents from '../../../components/molecules/TableContents';

export const Progress = (): React.ReactElement => {
  const router = useRouter();
  const taskPerPage: number = 3;
  const offset = router.query.offset ? Number.parseInt(String(router.query.offset), 10) : 0;
  const { fetchTaskInProgress, paginatedTaskInProgress, isLoading } = useProgress(offset);
  const { taskInProgress } = useGetTotalLengthOfTaskInProgress();

  const handleChangePage = useCallback(
    async (_: React.ChangeEvent<unknown>, page: number) => {
      await fetchTaskInProgress(page);
      router.push(`/progress/index/${page}`);
    },
    [router],
  );

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {paginatedTaskInProgress?.length !== 0 ? (
            <div>
              <TableContents
                tasks={paginatedTaskInProgress}
                th={['案件名', '保持者', '登録日時']}
                pathName={'progress'}
              />
              <Paginate contents={taskInProgress} perPage={taskPerPage} offset={offset} change={handleChangePage} />
            </div>
          ) : (
            '案件はありません。'
          )}
        </div>
      )}
    </>
  );
};

export default Progress;
