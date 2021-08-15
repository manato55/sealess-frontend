import { useUnreachedTask } from '../../hooks/useSWRFunc';
import Loading from '../../components/atoms/Loading';
import TableContents from '../../components/molecules/TableContents';

export const Unreached = (): React.ReactElement => {
  const { isLoading, unreachedTask } = useUnreachedTask();

  return (
    <>
      {!isLoading ? (
        unreachedTask?.length > 0 ? (
          <TableContents tasks={unreachedTask} th={['案件名', '担当者', '作成日時']} pathName={'unreached'} />
        ) : (
          '案件はありません。'
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Unreached;
