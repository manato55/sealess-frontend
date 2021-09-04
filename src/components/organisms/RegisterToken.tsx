import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate, useTokenCheck } from '../../hooks/useAuth';
import Password from '../molecules/Password';
import Button from '../atoms/Button';
import Loading from '../atoms/Loading';
import AuthWrapper from '../atoms/AuthWrapper';
import { authErrorMessage, http, eachErrorFlag } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

export const RegisterToken = (): React.ReactElement => {
  const router = useRouter();
  const [paramsToken, setParamsToken] = useState<string | string[]>(router.query.token);
  const { tokenChecker } = useTokenCheck(paramsToken);
  const { officialRegistryForNormalUser } = useAuthenticate();
  const [password, setPassword] = useState<string>('');
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const setHttpStatus = useSetRecoilState(http);
  const setErrorMessage = useSetRecoilState(authErrorMessage);

  const submitRegister = async () => {
    const data = {
      token: paramsToken,
      password: password,
    };
    setErrorFlag({ ...errorFlag, password: false });
    const res = await officialRegistryForNormalUser(data);
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
