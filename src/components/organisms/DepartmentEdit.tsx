import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDepartment } from '../../hooks/useSWRFunc';
import { http, authErrorMessage, eachErrorFlag } from '../../store/atom';
import { useSetRecoilState, useRecoilState } from 'recoil';
import styled from 'styled-components';
import UserRegisterWrapper from '../atoms/UserRegisterWrapper';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import { useAuthenticate } from '../../hooks/useAuth';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';

interface Props {}

const DepartmentEdit = (props: Props) => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { fetchedDepartment } = useDepartment();
  const setHttpStatus = useSetRecoilState(http);
  const [name, setName] = useState<string>('');
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const { deleteThisDep, changeDepName } = useAuthenticate();

  useEffect(() => {
    if (fetchedDepartment) {
      const extractedDep = fetchedDepartment.find((v) => v.id === paramsId);
      if (!extractedDep) {
        setHttpStatus(404);
        return;
      }
      setName(extractedDep.name);
    } else {
      router.push('/admin/dep-index');
    }
    return () => {
      setErrorMessage({ ...errorMessage, general: null });
      setErrorFlag({ ...errorFlag, name: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedDepartment]);

  const submit = () => {
    if (!confirm('この部に紐づくユーザーの部も変更となります。登録しますか？')) {
      return;
    }
    const DepInfo = {
      label: '部名',
      department_id: paramsId,
      name: name,
    };
    changeDepName(DepInfo);
  };

  return (
    <>
      <DeleteBtnWrapper>
        <span onClick={() => deleteThisDep(paramsId)}>この部を削除する</span>
      </DeleteBtnWrapper>
      <UserRegisterWrapper>
        <ErrorMessageWrapper>{errorMessage.general && errorMessage.general}</ErrorMessageWrapper>
        <NameInput name={name} setName={setName} placeHolder={'〇〇部'} />
        <Button onClick={submit} marginTop={20}>
          登録
        </Button>
      </UserRegisterWrapper>
    </>
  );
};

const DeleteBtnWrapper = styled.div`
  text-align: right;

  span {
    color: blue;
    text-decoration: underline;

    &:hover {
      cursor: pointer;
    }
  }
`;

export default DepartmentEdit;
