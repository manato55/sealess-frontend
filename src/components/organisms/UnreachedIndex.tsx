import { useUnreachedTask } from '../../hooks/useProgress';
import Loading from '../atoms/Loading';
import TableContents from '../molecules/TableContents';

export const UnreachedIndex = (): React.ReactElement => {
  const { isLoading, unreachedTask } = useUnreachedTask();

  return (
    <>
      {!isLoading ? (
        unreachedTask?.length > 0 ? (
          <TableContents
            tasks={unreachedTask}
            th={['案件名', '担当者', '作成日時']}
            pathName={'unreached'}
          />
        ) : (
          '案件はありません。'
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UnreachedIndex;
