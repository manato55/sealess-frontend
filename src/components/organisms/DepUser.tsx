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
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import UserRegisterWrapper from '../atoms/UserRegisterWrapper';
import { useDepartment } from '../../hooks/useSWRFunc';
import { AdminUser } from '../../hooks/useUser';

interface Props {
  adminUser: AdminUser[];
}

export const DepUser = (props: Props) => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { deleteDepAdminUser, changeDepAdminInfo } = useAuthenticate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const depRef = useRef(null);
  const setHttpStatus = useSetRecoilState(http);
  const errorMessage = useRecoilValue(authErrorMessage);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const { fetchedDepartment } = useDepartment();

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
      depRef.current.value = TmpAdminInfo.department.id;
      // ページをリロードした場合、props.adminUser情報が消去されるため前ページに戻す
    } else {
      router.push('/admin/dep-admin-user');
    }

    return () => {
      setErrorFlag({ ...errorFlag, name: false, email: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const DepAdminUserInfo = {
      userid: paramsId,
      name: name,
      email: email,
      department: depRef.current.value,
    };
    changeDepAdminInfo(DepAdminUserInfo);
  };

  return (
    <>
      <DeleteBtnWrapper>
        <span onClick={() => deleteDepAdminUser(paramsId)}>このユーザーを削除する</span>
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
