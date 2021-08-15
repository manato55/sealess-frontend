import React, { useState } from 'react';
import LoginForm from '../components/organisms/LoginForm';

export const Login = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <>
      <LoginForm email={email} password={password} setEmail={setEmail} setPassword={setPassword} />
    </>
  );
};

export default Login;
