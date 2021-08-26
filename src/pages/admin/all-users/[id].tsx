import React from 'react';
import { useNormalUser } from '../../../hooks/useUser';
import UserDepChange from '../../../components/organisms/UserDepChange';

export const UserEdit = () => {
  const { normalUser } = useNormalUser();

  return (
    <>
      <UserDepChange normalUser={normalUser} />
    </>
  );
};

export default UserEdit;
