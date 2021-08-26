import React, { useEffect } from 'react';
import { useAuthenticate } from '../../../hooks/useAuth';
import UsersIndex from '../../../components/molecules/UsersIndex';
import { useUser } from '../../../hooks/useUser';

export const UserIndex = () => {
  const { depUser } = useUser();

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
