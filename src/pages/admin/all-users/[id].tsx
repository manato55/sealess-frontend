import React from 'react';
import { useUpdateCompanyInfo } from '../../../hooks/useCompany';
import UserDepChange from '../../../components/organisms/UserDepChange';

export const UserEdit = () => {
  const { normalUser } = useUpdateCompanyInfo();

  return (
    <>
      <UserDepChange normalUser={normalUser} />
    </>
  );
};

export default UserEdit;
