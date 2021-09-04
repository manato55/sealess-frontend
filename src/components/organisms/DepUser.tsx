import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate } from '../../hooks/useAuth';
import { eachErrorFlag, authErrorMessage, http } from '../../store/atom';
import SelectBoxWrapper from '../atoms/SelectBoxWrapper';
import Email from '../molecules/Email';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import styled from 'styled-components';
import { useSetRecoilState, useRecoilState } from 'recoil';
import UserRegisterWrapper from '../atoms/UserRegisterWrapper';
import { AdminUser, useDepUser, useDepartment } from '../../hooks/useCompany';
import { toast } from 'react-toastify';

interface Props {
  adminUser: AdminUser[];
}

export const DepUser = (props: Props) => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { deleteDepAdminUser } = useAuthenticate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const depRef = useRef<HTMLSelectElement>(null);
  const setHttpStatus = useSetRecoilState(http);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const { fetchedDepartment } = useDepartment();
  const { changeDepAdminInfo } = useDepUser();
  const [departmentId, setDepartmentId] = useState<number>();

  useEffect(() => {
    if (props.adminUser) {
      const TmpAdminInfo = props.adminUser.find((v) => v.id === paramsId);
      // useridを直打ちしてきた場合はNOT FOUNDへ遷移
      if (!TmpAdminInfo) {
        setHttpStatus(404);
        return;
      }
      setName(TmpAdminInfo.name);
      setEmail(TmpAdminInfo.email);
      setDepartmentId(TmpAdminInfo.department.id);
      // ページをリロードした場合、props.adminUser情報が消去されるため前ページに戻す
    } else {
      router.push('/admin/dep-admin-user');
    }

    return () => {
      setErrorFlag({ ...errorFlag, name: false, email: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fetchedDepartment) {
      depRef.current.value = String(departmentId);
    }
  }, [fetchedDepartment, departmentId]);

  const submit = async () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const info = {
      userid: paramsId,
      name: name,
      email: email,
      department: depRef.current.value,
    };
    setErrorFlag({ ...errorFlag, name: false, email: false });
    const res = await changeDepAdminInfo(info);
    if (!res.isFailure) {
      router.push('/admin/dep-admin-user');
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

  const remove = async () => {
    if (!confirm('削除しますか？')) {
      return;
    }
    const res = await deleteDepAdminUser(paramsId);
    if (!res.isFailure) {
      toast.success('削除しました。');
      router.push('/admin/dep-admin-user');
    } else {
      setHttpStatus(res.error.code);
    }
  };

  return (
    <>
      <DeleteBtnWrapper>
        <span onClick={() => remove()}>このユーザーを削除する</span>
      </DeleteBtnWrapper>
      <UserRegisterWrapper>
        <NameInput name={name} setName={setName} placeHolder={'氏名'} />
        <Email email={email} setEmail={setEmail} />
        <ErrorMessageWrapper>
          {errorFlag.department && errorMessage.department[0]}
        </ErrorMessageWrapper>
        <SelectBoxWrapper ref={depRef}>
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

export default DepUser;
