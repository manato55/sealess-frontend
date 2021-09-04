import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Paginate from '../molecules/Paginate';
import TableContents from '../molecules/TableContents';
import Loading from '../atoms/Loading';
import { http } from '../../store/atom';
import { useSetRecoilState } from 'recoil';
import { useGetTotalLengthOfTaskInProgress, useTaskInProgress } from '../../hooks/useTaskLength';

export const ProgressIndex = (): React.ReactElement => {
  const router = useRouter();
  const taskPerPage = 3;
  const offset = router.query.offset ? Number.parseInt(String(router.query.offset), 10) : 0;
  const { paginatedTaskInProgress, isLoading } = useTaskInProgress(offset);
  const { taskInProgress } = useGetTotalLengthOfTaskInProgress();

  const handleChangePage = useCallback(
    async (_: React.ChangeEvent<unknown>, page: number) => {
      await router.push(`/progress/index/${page}`);
    },
    [router]
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {paginatedTaskInProgress?.length > 0 ? (
            <div>
              <TableContents
                tasks={paginatedTaskInProgress}
                th={['案件名', '保持者', '登録日時']}
                pathName={'progress'}
              />
              <Paginate
                contents={taskInProgress}
                perPage={taskPerPage}
                offset={offset}
                change={handleChangePage}
              />
            </div>
          ) : (
            '案件はありません。'
          )}
        </div>
      )}
    </>
  );
};

export default ProgressIndex;
