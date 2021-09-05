import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { http, authErrorMessage, eachErrorFlag } from '../../store/atom';
import { useSetRecoilState, useRecoilState } from 'recoil';
import styled from 'styled-components';
import UserRegisterWrapper from '../atoms/UserRegisterWrapper';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import { toast } from 'react-toastify';
import { useUpdateCompanyInfo, useDepartment, useDepSecIndex } from '../../hooks/useCompany';

interface Props {}

const DepartmentEdit = (props: Props) => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { fetchedDepartment } = useDepartment();
  const setHttpStatus = useSetRecoilState(http);
  const [name, setName] = useState<string>('');
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const { changeDepName } = useUpdateCompanyInfo();
  const { deleteThisDep } = useDepSecIndex();

  useEffect(() => {
    if (fetchedDepartment) {
      const extractedDep = fetchedDepartment.find((v) => v.id === paramsId);
      if (!extractedDep) {
        setHttpStatus(404);
        return;
      }
      setName(extractedDep.name);
    }
    return () => {
      setErrorMessage({ ...errorMessage, general: null });
      setErrorFlag({ ...errorFlag, name: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedDepartment]);

  const submit = async () => {
    if (!confirm('この部に紐づくユーザーの部も変更となります。登録しますか？')) {
      return;
    }
    const DepInfo = {
      label: '部名',
      department_id: paramsId,
      name: name,
    };
    setErrorFlag({ ...errorFlag, name: false });
    const res = await changeDepName(DepInfo);
    if (!res.isFailure) {
      router.push('/admin/dep-index');
      toast.success('登録完了');
    } else {
      if (res.error.code === 422) {
        setErrorMessage(res.error.message);
        const isName = res.error.message.name ? true : false;
        setErrorFlag({ ...errorFlag, name: isName });
      } else {
        setHttpStatus(res.error.code);
      }
    }
  };

  const remove = async () => {
    if (!confirm('削除しますか？')) {
      return;
    }
    setErrorMessage({ ...errorMessage, general: null });
    const res = await deleteThisDep(paramsId);
    if (!res.isFailure) {
      toast.success('削除しました。');
      router.push('/admin/dep-index');
    } else {
      if (res.error.code === 422) {
        setErrorMessage({ ...errorMessage, general: res.data.error });
      } else {
        setHttpStatus(res.error.code);
      }
    }
  };

  return (
    <>
      <DeleteBtnWrapper>
        <span onClick={() => remove()}>この部を削除する</span>
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
