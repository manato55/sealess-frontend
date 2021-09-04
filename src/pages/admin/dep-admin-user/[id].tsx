import { useDepUser } from '../../../hooks/useCompany';
import DepUser from '../../../components/organisms/DepUser';

export const DepAdminDetailInfo = () => {
  const { adminUser } = useDepUser();

  return (
    <>
      <DepUser adminUser={adminUser} />
    </>
  );
};

export default DepAdminDetailInfo;
