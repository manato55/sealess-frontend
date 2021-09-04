import ProgressIndex from '../../../components/organisms/ProgressIndex';
import { useGetTotalLengthOfTaskInProgress } from '../../../hooks/useTaskLength';

export const Progress = (): React.ReactElement => {
  return (
    <>
      <ProgressIndex />
    </>
  );
};

export default Progress;
