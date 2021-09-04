import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePwTokenCheck } from '../../hooks/useAuth';
import Password from '../molecules/Password';
import PasswordConfirm from '../molecules/PasswordConfirm';
import Button from '../atoms/Button';
import AuthWrapper from '../atoms/AuthWrapper';
import { http, authErrorMessage, eachErrorFlag } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import Loading from '../atoms/Loading';

export const PasswordToken = () => {
  const router = useRouter();
  const [paramsToken, setParamsToken] = useState<any>(router.query.token);
  const { passwordTokenChecker, reRegisterPassword } = usePwTokenCheck(paramsToken);
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const setHttpStatus = useSetRecoilState(http);
  const setErrorMessage = useSetRecoilState(authErrorMessage);

  const submitRegister = async () => {
    if (password !== passwordConfirm) {
      alert('passwordが一致しません。');
      return;
    }
    const data = {
      token: paramsToken,
      password: password,
    };
    setErrorFlag({ ...errorFlag, password: false });
    const res = await reRegisterPassword(data);
    if (!res.isFailure) {
      router.push('/login');
      toast.success('登録完了');
    } else {
      if (res.error.code === 422) {
        setErrorMessage(res.error.message);
        setErrorFlag({ ...errorFlag, password: true });
      } else {
        setHttpStatus(res.error.code);
      }
    }
  };

  return (
    <>
      {passwordTokenChecker ? (
        <AuthWrapper>
          <Password password={password} setPassword={setPassword} />
          <PasswordConfirm
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
          />
          <Button onClick={() => submitRegister()}>登録</Button>
        </AuthWrapper>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default PasswordToken;
