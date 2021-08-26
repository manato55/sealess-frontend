import React, { useState, useEffect } from 'react';
import AuthWrapper from '../atoms/AuthWrapper';
import Button from '../atoms/Button';
import NameInput from '../molecules/NameInput';
import Email from '../molecules/Email';
import { useAuthenticate } from '../../hooks/useAuth';
import { useRecoilState } from 'recoil';
import { eachErrorFlag } from '../../store/atom';

interface Props {}

const CompanyRegister = (props: Props) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const { registerCompany } = useAuthenticate();
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, email: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm('登録しますか？')) {
      return;
    }
    const user = {
      email: email,
      name: name,
      label: '企業名',
    };
    registerCompany(user);
  };

  return (
    <>
      <AuthWrapper>
        <form onSubmit={handleSubmit}>
          <NameInput name={name} setName={setName} placeHolder={'企業名'} />
          <Email email={email} setEmail={setEmail} />
          <Button type="submit">登録</Button>
        </form>
      </AuthWrapper>
    </>
  );
};

export default CompanyRegister;
