import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import Password from '../../components/molecules/Password';
import Button from '../../components/atoms/Button';
import AuthWrapper from '../../components/atoms/AuthWrapper';

export const Token = (): React.ReactElement => {
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
  }, [paramsToken]);

  async function submitRegister(): Promise<void> {
    const data: {
      token: string;
      password: string;
    } = {
      token: paramsToken,
      password: password,
    };
    await officialRegistryForOrdinaryUser(data);
  }

  return (
    <>
      {tokenChecker ? (
        <AuthWrapper>
          <Password password={password} setPassword={setPassword} />
          <Button onClick={() => submitRegister()}>登録</Button>
        </AuthWrapper>
      ) : (
        'Loading...'
      )}
    </>
  );
};

export default Token;
