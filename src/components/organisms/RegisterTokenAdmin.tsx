import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate } from '../../hooks/useAuth';
import Password from '../molecules/Password';
import Button from '../atoms/Button';
import Loading from '../atoms/Loading';
import AuthWrapper from '../atoms/AuthWrapper';
import NameInput from '../molecules/NameInput';
import { eachErrorFlag } from '../../store/atom';
import { useRecoilState } from 'recoil';

interface Props {}

const RegisterTokenAdmin = (props: Props) => {
  const router = useRouter();
  const { adminTokenCheck } = useAuthenticate();
  const { officialRegistryForAdmin } = useAuthenticate();
  const [paramsToken, setParamsToken] = useState<any>(router.query.token);
  const [tokenChecker, setTokenChecker] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);

  useEffect(() => {
    const initialAction = async () => {
      const res = await adminTokenCheck(paramsToken);
      if (res) {
        setTokenChecker(true);
      }
    };
    initialAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      setErrorFlag({ ...errorFlag, name: false, password: false });
    };
  }, [paramsToken]);

  const submit = () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const data = {
      token: paramsToken,
      password: password,
      name: name,
      label: 'ユーザー名',
    };
    officialRegistryForAdmin(data);
  };

  return (
    <>
      {tokenChecker ? (
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
