import React from 'react';
import { useDepUser } from '../../../hooks/useUser';
import UsersIndex from '../../../components/molecules/UsersIndex';
import Loading from '../../../components/atoms/Loading';

export const DepAdminUser = () => {
  const { adminUser, isLoading } = useDepUser();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <UsersIndex
          users={adminUser}
          th={['名称', '部', 'メールアドレス']}
          displayContents={['name', 'department', 'email']}
          isEmail={true}
        />
      )}
    </>
  );
};

export default DepAdminUser;
