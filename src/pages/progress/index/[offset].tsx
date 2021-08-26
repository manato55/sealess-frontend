import ProgressIndex from '../../../components/organisms/ProgressIndex';
import { useGetTotalLengthOfTaskInProgress } from '../../../hooks/useTaskLength';

export const Progress = (): React.ReactElement => {
  const { taskInProgress } = useGetTotalLengthOfTaskInProgress();

  return (
    <>
      <ProgressIndex taskInProgress={taskInProgress} />
    </>
  );
};

export default Progress;
