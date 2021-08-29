import { useState } from 'react';
import DepJobTitleChoices from '../molecules/DepJobTItleChoices';
import JobTitleEdit from '../organisms/JobTitleEdit';
import DepSecEditIndex from './DepSecEditIndex';

interface Props {}

const DepSec = (props: Props) => {
  const [currComponent, setCurrComponent] = useState<string>('department');

  return (
    <>
      <DepJobTitleChoices currComponent={currComponent} setCurrComponent={setCurrComponent} />
      {currComponent === 'department' ? <DepSecEditIndex /> : <JobTitleEdit />}
    </>
  );
};

export default DepSec;
