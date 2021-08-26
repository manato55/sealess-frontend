import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate } from '../../hooks/useAuth';
import Password from '../molecules/Password';
import PasswordConfirm from '../molecules/PasswordConfirm';
import Button from '../atoms/Button';
import AuthWrapper from '../atoms/AuthWrapper';

export const PasswordToken = () => {
  const router = useRouter();
  const { passwordTokenCheck, reRegisterPassword } = useAuthenticate();
  const [paramsToken, setParamsToken] = useState<any>(router.query.token);
  const [tokenChecker, setTokenChecker] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  useEffect(() => {
    const initialAction = async () => {
      const res = await passwordTokenCheck(paramsToken);
      if (res) {
        setTokenChecker(true);
      }
    };
    initialAction();
  }, [paramsToken]);

  const submitRegister = () => {
    if (password !== passwordConfirm) {
      alert('passwordが一致しません。');
      return;
    }
    const data: {
      token: string;
      password: string;
    } = {
      token: paramsToken,
      password: password,
    };
    reRegisterPassword(data);
  };

  return (
    <>
      {tokenChecker ? (
        <AuthWrapper>
          <Password password={password} setPassword={setPassword} />
          <PasswordConfirm
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
          />
          <Button onClick={() => submitRegister()}>登録</Button>
        </AuthWrapper>
      ) : (
        'Loading...'
      )}
    </>
  );
};

export default PasswordToken;
