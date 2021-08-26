import { useState } from 'react';
import DepSecChoice from '../molecules/DepSecChoice';
import DepRegistryForm from '../organisms/DepRegistryForm';
import SecRegistryForm from '../organisms/SecRegistryForm';
import JobTitleRegistryForm from '../organisms/JobTitleRegistryForm';

interface Props {}

const DepSecRegisterForm = (props: Props) => {
  const [currComponent, setCurrComponent] = useState<string>('department');
  const [department, setDepartment] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');

  return (
    <>
      <DepSecChoice currComponent={currComponent} setCurrComponent={setCurrComponent} />
      {currComponent === 'department' ? (
        <DepRegistryForm department={department} setDepartment={setDepartment} />
      ) : currComponent === 'section' ? (
        <SecRegistryForm section={section} setSection={setSection} />
      ) : (
        <JobTitleRegistryForm jobTitle={jobTitle} setJobTitle={setJobTitle} />
      )}
    </>
  );
};

export default DepSecRegisterForm;
