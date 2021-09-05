import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate } from '../../hooks/useAuth';
import { userStatus, eachErrorFlag, authErrorMessage, http } from '../../store/atom';
import SelectBoxWrapper from '../atoms/SelectBoxWrapper';
import Email from '../molecules/Email';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import styled from 'styled-components';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import {
  useFetchDepartmentUser,
  useJobTitle,
  useSetionsByDepartmentId,
} from '../../hooks/useCompany';
import UserRegisterWrapper from '../atoms/UserRegisterWrapper';
import { toast } from 'react-toastify';

interface Props {}

const EditNormalUser = (props: Props) => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { deleteNormalUser } = useAuthenticate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const user = useRecoilValue(userStatus);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const sectionRef = useRef(null);
  const jobTitleRef = useRef(null);
  const setHttpStatus = useSetRecoilState(http);
  const { depUser } = useFetchDepartmentUser();
  const { fetchedSections } = useSetionsByDepartmentId(user?.department_id);
  const { fetchedJobTitle } = useJobTitle();
  const { editNormalUserInfo } = useFetchDepartmentUser();

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, email: false, section: false, department: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (depUser && fetchedSections && fetchedJobTitle) {
      const extractedUser = depUser.find((v) => v.id === paramsId);
      // useridを直打ちしてきた場合はNOT FOUNDへ遷移
      if (!extractedUser) {
        setHttpStatus(404);
        return;
      }
      setName(extractedUser.name);
      setEmail(extractedUser.email);
      sectionRef.current.value = extractedUser.section.id;
      jobTitleRef.current.value = extractedUser.job_title.id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depUser, fetchedSections, fetchedJobTitle]);

  const submit = async () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const info = {
      userid: paramsId,
      name: name,
      email: email,
      department: user.department_id,
      section: sectionRef.current.value,
      jobTitle: jobTitleRef.current.value,
    };
    setErrorFlag({ ...errorFlag, name: false, email: false });
    const res = await editNormalUserInfo(info);
    if (!res.isFailure) {
      toast.success('登録しました。');
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

  const onClick = async () => {
    if (!confirm('削除しますか？')) {
      return;
    }
    const res = await deleteNormalUser(paramsId);
    if (!res.isFailure) {
      toast.success('削除しました。');
      router.push('/dep-admin/users');
    } else {
      setHttpStatus(res.error.code);
    }
  };

  return (
    <>
      <DeleteBtnWrapper>
        <span onClick={() => onClick()}>このユーザーを削除する</span>
      </DeleteBtnWrapper>
      <UserRegisterWrapper>
        <NameInput name={name} setName={setName} placeHolder={'氏名'} />
        <Email email={email} setEmail={setEmail} />
        <ErrorMessageWrapper>{errorFlag.section && errorMessage.section[0]}</ErrorMessageWrapper>
        <SelectBoxWrapper defaultValue={'choice'} ref={sectionRef}>
          <option value="choice" disabled>
            課を選択してください
          </option>
          {fetchedSections?.map((v, index) => (
            <option key={index} value={v.id}>
              {v.name}
            </option>
          ))}
        </SelectBoxWrapper>
        <ErrorMessageWrapper>{errorFlag.jobTitle && errorMessage.jobTitle[0]}</ErrorMessageWrapper>
        <SelectBoxWrapper defaultValue={'choice'} ref={jobTitleRef}>
          <option value="choice" disabled>
            役職を選択してください
          </option>
          {fetchedJobTitle?.map((v, index) => (
            <option key={index} value={v.id}>
              {v.name}
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

export default EditNormalUser;
