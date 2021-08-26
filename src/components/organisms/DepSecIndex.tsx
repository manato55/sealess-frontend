import { useState } from 'react';
import DepJobTitleChoices from '../molecules/DepJobTItleChoices';
import DepRegistryForm from '../organisms/DepRegistryForm';
import SecRegistryForm from '../organisms/SecRegistryForm';
import JobTitleRegistryForm from '../organisms/JobTitleRegistryForm';
import DepSecEditIndex from './DepSecEditIndex';

interface Props {}

const DepSec = (props: Props) => {
  const [currComponent, setCurrComponent] = useState<string>('department');
  const [department, setDepartment] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');

  return (
    <>
      <DepJobTitleChoices currComponent={currComponent} setCurrComponent={setCurrComponent} />
      {currComponent === 'department' ? (
        <DepSecEditIndex />
      ) : (
        <JobTitleRegistryForm jobTitle={jobTitle} setJobTitle={setJobTitle} />
      )}
    </>
  );
};

export default DepSec;
