import React, { useState, useCallback, useEffect } from 'react';
import RegisterCommonForm from '../molecules/RegisterCommonForm';
import NameInput from '../molecules/NameInput';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Button from '../atoms/Button';
import SelectBoxWrapper from '../atoms/SelectBoxWrapper';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { authErrorMessage, eachErrorFlag, http } from '../../store/atom';
import UserRegisterWrapper from '../atoms/UserRegisterWrapper';
import { useDepSecIndex, useDepartment } from '../../hooks/useCompany';
import { toast } from 'react-toastify';

interface Props {}

export const CreateDepAdminUser = (props: Props) => {
  const { registerDepAdmin } = useDepSecIndex();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [department, setDepartment] = useState<number>();
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const { fetchedDepartment } = useDepartment();
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const setHttpStatus = useSetRecoilState(http);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, email: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const user = {
      name: name,
      email: email,
      password: password,
      department: department,
    };
    setErrorFlag({ ...errorFlag, name: false, department: false, email: false, password: false });
    const res = await registerDepAdmin(user);
    if (!res.isFailure) {
      toast.success('登録しました。');
    } else {
      if (res.error.code === 422) {
        setErrorFlag({
          ...errorFlag,
          department: res.error.message.department,
          name: res.error.message.name,
          password: res.error.message.password,
          email: res.error.message.email,
        });
      } else {
        setHttpStatus(res.error.code);
      }
    }
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
        <SelectBoxWrapper
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setDepartment(Number(e.target.value))
          }
          defaultValue={'choice'}
        >
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
