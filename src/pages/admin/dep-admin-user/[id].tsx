import { useDepUser } from '../../../hooks/useUser';
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
