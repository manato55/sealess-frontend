import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate, useAdminTokenCheck } from '../../hooks/useAuth';
import Password from '../molecules/Password';
import Button from '../atoms/Button';
import Loading from '../atoms/Loading';
import AuthWrapper from '../atoms/AuthWrapper';
import NameInput from '../molecules/NameInput';
import { authErrorMessage, eachErrorFlag, http } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

interface Props {}

const RegisterTokenAdmin = (props: Props) => {
  const router = useRouter();
  const [paramsToken, setParamsToken] = useState<string | string[]>(router.query.token);
  const { adminTokenChecker } = useAdminTokenCheck(paramsToken);
  const { officialRegistryForAdmin } = useAuthenticate();
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const setErrorMessage = useSetRecoilState(authErrorMessage);
  const setHttpStatus = useSetRecoilState(http);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, password: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const data = {
      token: paramsToken,
      password: password,
      name: name,
      label: 'ユーザー名',
    };
    setErrorFlag({ ...errorFlag, name: false, password: false });
    const res = await officialRegistryForAdmin(data);
    if (!res.isFailure) {
      toast.success('登録完了');
      router.push('/login');
    } else {
      if (res.error.code === 422) {
        setErrorMessage(res.data.errors);
        setErrorFlag({
          ...errorFlag,
          name: res.data.errors.name,
          password: res.data.errors.password,
        });
      } else {
        setHttpStatus(res.error.code);
      }
    }
  };

  return (
    <>
      {adminTokenChecker ? (
        <AuthWrapper>
          <NameInput name={name} setName={setName} placeHolder={'ユーザー名'} />
          <Password password={password} setPassword={setPassword} />
          <Button onClick={() => submit()}>登録</Button>
        </AuthWrapper>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default RegisterTokenAdmin;
