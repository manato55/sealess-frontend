import React, { useEffect } from 'react';
import UsersIndex from '../../../components/molecules/UsersIndex';
import { useFetchDepartmentUser } from '../../../hooks/useCompany';

export const UserIndex = () => {
  const { depUser } = useFetchDepartmentUser();

  return (
    <>
      <UsersIndex
        users={depUser}
        th={['名前', '役職', '課']}
        displayContents={['name', 'job_title', 'section']}
      />
    </>
  );
};

export default UserIndex;
