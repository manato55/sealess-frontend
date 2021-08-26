import { useState, useEffect } from 'react';
import PasswordIssuanceForm from '../../components/organisms/PasswordIssuanceForm';
import { useRecoilState } from 'recoil';
import { eachErrorFlag } from '../../store/atom';

export const PasswordIssuance = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, email: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PasswordIssuanceForm email={email} setEmail={setEmail} />
    </>
  );
};

export default PasswordIssuance;
