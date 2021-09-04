import React, { useState, useEffect } from 'react';
import AuthWrapper from '../atoms/AuthWrapper';
import Button from '../atoms/Button';
import NameInput from '../molecules/NameInput';
import Email from '../molecules/Email';
import { useAuthenticate } from '../../hooks/useAuth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authErrorMessage, eachErrorFlag, http } from '../../store/atom';
import { toast } from 'react-toastify';

interface Props {}

const CompanyRegister = (props: Props) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const { registerCompany } = useAuthenticate();
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const setHttpStatus = useSetRecoilState(http);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, email: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm('登録しますか？')) {
      return;
    }
    const user = {
      email: email,
      name: name,
      label: '企業名',
    };
    setErrorFlag({ ...errorFlag, name: false, email: false });
    const res = await registerCompany(user);
    if (!res.isFailure) {
      toast.success('登録完了');
    } else {
      if (res.error.code === 422) {
        setErrorMessage(res.error.message);
        setErrorFlag({
          ...errorFlag,
          name: res.error.message.name,
          email: res.error.message.email,
        });
      } else {
        setHttpStatus(res.error.code);
      }
    }
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
