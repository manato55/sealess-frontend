import React, { useState, useCallback, useEffect } from 'react';
import RegisterCommonForm from '../molecules/RegisterCommonForm';
import NameInput from '../molecules/NameInput';
import { DEPARTMENT } from '../../const/JobInfo';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Button from '../atoms/Button';
import SelectBoxWrapper from '../atoms/SelectBoxWrapper';
import { useRecoilValue, useRecoilState } from 'recoil';
import { authErrorMessage, eachErrorFlag } from '../../store/atom';
import { useAuthenticate } from '../../hooks/useAuth';
import UserRegisterWrapper from '../atoms/UserRegisterWrapper';
import {useDepartment} from '../../hooks/useSWRFunc'

type User = {
  name: string;
  email: string;
  password: string;
  department: number;
};

interface Props {}

export const CreateDepAdminUser = (props: Props) => {
  const { registerDepAdmin } = useAuthenticate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [department, setDepartment] = useState<number>();
  const errorMessage = useRecoilValue(authErrorMessage);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const { fetchedDepartment } = useDepartment();

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, email: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const user: User = {
      name: name,
      email: email,
      password: password,
      department: department,
    };
    registerDepAdmin(user);
  };

  return (
    <>
      <UserRegisterWrapper>
        <NameInput name={name} setName={setName} placeHolder={'氏名'} />
        <RegisterCommonForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <ErrorMessageWrapper>{errorFlag.department && errorMessage.department}</ErrorMessageWrapper>
        <SelectBoxWrapper onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartment(Number(e.target.value))} defaultValue={'choice'}>
          <option value="choice" disabled>
            部を選択してください
          </option>
          {fetchedDepartment?.map((dep, index) => (
            <option key={index} value={dep.id}>
              {dep.name}
            </option>
          ))}
        </SelectBoxWrapper>
        <Button onClick={submit} marginTop={20}>
          登録
        </Button>
      </UserRegisterWrapper>
    </>
  );
};

export default CreateDepAdminUser;
