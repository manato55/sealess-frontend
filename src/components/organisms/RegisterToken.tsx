import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate } from '../../hooks/useAuth';
import Password from '../molecules/Password';
import Button from '../atoms/Button';
import Loading from '../atoms/Loading';
import AuthWrapper from '../atoms/AuthWrapper';

export const RegisterToken = (): React.ReactElement => {
  const router = useRouter();
  const { tokenCheck } = useAuthenticate();
  const { officialRegistryForOrdinaryUser } = useAuthenticate();
  const [paramsToken, setParamsToken] = useState<any>(router.query.token);
  const [tokenChecker, setTokenChecker] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const initialAction = async () => {
      const res = await tokenCheck(paramsToken);
      if (res) {
        setTokenChecker(true);
      }
    };
    initialAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsToken]);

  const submitRegister = () => {
    const data: {
      token: string;
      password: string;
    } = {
      token: paramsToken,
      password: password,
    };
    officialRegistryForOrdinaryUser(data);
  };

  return (
    <>
      {tokenChecker ? (
        <AuthWrapper>
          <Password password={password} setPassword={setPassword} />
          <Button onClick={() => submitRegister()}>登録</Button>
        </AuthWrapper>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default RegisterToken;
