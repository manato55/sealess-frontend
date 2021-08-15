import { useState } from 'react';
import PasswordIssuanceForm from '../../components/organisms/PasswordIssuanceForm';

export const PasswordIssuance = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');

  return (
    <>
      <PasswordIssuanceForm email={email} setEmail={setEmail} />
    </>
  );
};

export default PasswordIssuance;
