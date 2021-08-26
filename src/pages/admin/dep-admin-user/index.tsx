import React from 'react';
import { useDepUser } from '../../../hooks/useUser';
import UsersIndex from '../../../components/molecules/UsersIndex';

export const DepAdminUser = () => {
  const { adminUser } = useDepUser();

  return (
    <>
      <UsersIndex
        users={adminUser}
        th={['名称', '部', 'メールアドレス']}
        displayContents={['name', 'department', 'email']}
      />
    </>
  );
};

export default DepAdminUser;
