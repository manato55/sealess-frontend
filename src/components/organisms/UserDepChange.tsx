import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { http, authErrorMessage, eachErrorFlag } from '../../store/atom';
import SelectBoxWrapper from '../atoms/SelectBoxWrapper';
import { DEPARTMENT, SECTION } from '../../const/JobInfo';
import styled from 'styled-components';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import { useAuthenticate } from '../../hooks/useAuth';
import Button from '../atoms/Button';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import {AdminUser} from '../../hooks/useUser'

interface Props {
  normalUser: AdminUser[];
}


export const UserDepChange = (props: Props) => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const setHttpStatus = useSetRecoilState(http);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const [userInfo, setUserInfo] = useState<AdminUser>();
  const depRef = useRef(null);
  const sectionRef = useRef(null);
  const [department, setDepartment] = useState<string>();
  const { changeDepartment } = useAuthenticate();
  const [section, setSection] = useState<string[]>([]);
  const errorMessage = useRecoilValue(authErrorMessage);

  useEffect(() => {
    if (props.normalUser) {
      const extractedUser = props.normalUser.find((v) => v.id === paramsId);
      // useridを直打ちしてきた場合はNOT FOUNDへ遷移
      if (!extractedUser) {
        setHttpStatus(404);
        return;
      }
      depRef.current.value = extractedUser.department;
      setUserInfo(extractedUser);
      setDepartment(extractedUser.department);
    } else {
      router.push('/admin/all-users');
    }

    return () => {
      setErrorFlag({ ...errorFlag, name: false, department: false, email: false, password: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.normalUser]);

  useEffect(() => {
    if (department) {
      const deferredAction = async () => {
        await switcher(department);
        sectionRef.current.value = userInfo.section;
      };
      deferredAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  const switcher = (dep) => {
    switch (dep) {
      case '経営企画部':
        setSection(SECTION.management);
        break;
      case '開発部':
        setSection(SECTION.dev);
        break;
    }
  };

  const depChoice = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    sectionRef.current.value = '';
    const choiceDep: string = e.target.value;
    switcher(choiceDep);
  }, []);

  const submit = () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const userInfo = {
      userid: paramsId,
      department: depRef.current.value,
      section: sectionRef.current.value,
    };
    changeDepartment(userInfo);
  };

  return (
    <>
      <Title>ユーザー名</Title>
      <li>{userInfo?.name}</li>
      <Title>所属部署</Title>
      <ErrorMessageWrapper>
        {errorFlag.department && errorMessage.department[0]}
      </ErrorMessageWrapper>
      <SelectBoxEdition onChange={(e) => depChoice(e)} ref={depRef}>
        {DEPARTMENT.map((v, index) => (
          <option key={index} value={v}>
            {v}
          </option>
        ))}
      </SelectBoxEdition>
      <ErrorMessageWrapper>{errorFlag.section && errorMessage.section[0]}</ErrorMessageWrapper>
      <SelectBoxEdition ref={sectionRef}>
        <option value="" disabled>
          課を選択してください
        </option>
        {section?.map((v, index) => (
          <option key={index} value={v}>
            {v}
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
