import React, { useCallback, useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { useRouter } from 'next/router';
import Paginate from '../molecules/Paginate';
import TableContents from '../molecules/TableContents';
import Loading from '../atoms/Loading';
import { http } from '../../store/atom';
import { useSetRecoilState } from 'recoil';

interface Props {
  taskInProgress: object[];
}

export const ProgressIndex = (props: Props): React.ReactElement => {
  const router = useRouter();
  const taskPerPage: number = 3;
  const offset = router.query.offset ? Number.parseInt(String(router.query.offset), 10) : 0;
  const { fetchTaskInProgress, paginatedTaskInProgress, isLoading } = useProgress(offset);
  const setHttpStatus = useSetRecoilState(http);

  const handleChangePage = useCallback(
    async (_: React.ChangeEvent<unknown>, page: number) => {
      await fetchTaskInProgress(page);
      router.push(`/progress/index/${page}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  );

  useEffect(() => {
    if (paginatedTaskInProgress?.length === 0) {
      setHttpStatus(404);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedTaskInProgress]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {paginatedTaskInProgress?.length !== 0 ? (
            <div>
              <TableContents
                tasks={paginatedTaskInProgress}
                th={['案件名', '保持者', '登録日時']}
                pathName={'progress'}
              />
              <Paginate
                contents={props.taskInProgress}
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
