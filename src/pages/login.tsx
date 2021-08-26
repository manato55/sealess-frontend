import React, { useState, useEffect } from 'react';
import LoginForm from '../components/organisms/LoginForm';
import { useRecoilState } from 'recoil';
import { eachErrorFlag } from '../store/atom';

export const Login = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, email: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LoginForm email={email} password={password} setEmail={setEmail} setPassword={setPassword} />
    </>
  );
};

export default Login;
