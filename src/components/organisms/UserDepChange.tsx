import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { http, authErrorMessage, eachErrorFlag } from '../../store/atom';
import SelectBoxWrapper from '../atoms/SelectBoxWrapper';
import styled from 'styled-components';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import Button from '../atoms/Button';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import { AdminUser, useNormalUser, useSetionsByDepartmentId } from '../../hooks/useUser';
import { useDepartment } from '../../hooks/useSWRFunc';
import { toast } from 'react-toastify';

interface Props {
  normalUser: AdminUser[];
}

export const UserDepChange = (props: Props) => {
  const [departmentId, setDepartmentId] = useState<number>();
  const { fetchedSections } = useSetionsByDepartmentId(departmentId);
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const setHttpStatus = useSetRecoilState(http);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const [userInfo, setUserInfo] = useState<AdminUser>();
  const depRef = useRef(null);
  const sectionRef = useRef(null);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const { fetchedDepartment } = useDepartment();
  const { changeDepartment } = useNormalUser();

  useEffect(() => {
    if (props.normalUser) {
      const extractedUser = props.normalUser.find((v) => v.id === paramsId);
      setDepartmentId(extractedUser.department.id);
      // useridを直打ちしてきた場合はNOT FOUNDへ遷移
      if (!extractedUser) {
        setHttpStatus(404);
        return;
      }
      depRef.current.value = extractedUser.department.id;
      setUserInfo(extractedUser);
    } else {
      router.push('/admin/all-users');
    }

    return () => {
      setErrorFlag({ ...errorFlag, name: false, department: false, email: false, password: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fetchedSections && userInfo && sectionRef.current.value !== '') {
      sectionRef.current.value = userInfo.section.id;
    }
  }, [userInfo, fetchedSections]);

  const submit = async () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const user = {
      userid: paramsId,
      department: depRef.current.value,
      section: sectionRef.current.value,
    };
    setErrorFlag({ ...errorFlag, department: false, section: false });
    const res = await changeDepartment(user);
    if (res.status === 200) {
      router.push('/admin/all-users');
      toast.success('登録完了');
    } else if (res.status === 422) {
      setErrorMessage(res.data.errors);
      const isDep = res.data.errors.department ? true : false;
      const isSection = res.data.errors.section ? true : false;
      setErrorFlag({ ...errorFlag, department: isDep, section: isSection });
    } else {
      setHttpStatus(res.status);
    }
  };

  const depChoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentId(Number(e.target.value));
    sectionRef.current.value = '';
  };

  return (
    <>
      <Title>ユーザー名</Title>
      <li>{userInfo?.name}</li>
      <Title>所属部署</Title>
      <ErrorMessageWrapper>
        {errorFlag.department && errorMessage.department[0]}
      </ErrorMessageWrapper>
      <SelectBoxEdition
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => depChoice(e)}
        ref={depRef}
      >
        {fetchedDepartment?.map((v, index) => (
          <option key={index} value={v.id}>
            {v.name}
          </option>
        ))}
      </SelectBoxEdition>
      <ErrorMessageWrapper>{errorFlag.section && errorMessage.section[0]}</ErrorMessageWrapper>
      <SelectBoxEdition ref={sectionRef}>
        <option value="" disabled>
          課を選択してください
        </option>
        {fetchedSections?.map((v, index) => (
          <option key={index} value={v.id}>
            {v.name}
          </option>
        ))}
      </SelectBoxEdition>
      <Button onClick={() => submit()}>登録</Button>
    </>
  );
};

const SelectBoxEdition = styled(SelectBoxWrapper)`
  width: 50%;
  display: block;
  margin-bottom: 20px;
`;

const Title = styled.p`
  text-decoration: underline;
  margin-top: 20px;
`;

export default UserDepChange;
