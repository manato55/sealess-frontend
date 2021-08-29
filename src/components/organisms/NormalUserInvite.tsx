import React, { useEffect, useState } from 'react';
import Email from '../../components/molecules/Email';
import NameInput from '../../components/molecules/NameInput';
import { SECTION, JOBTITLE } from '../../const/JobInfo';
import { useAuthenticate } from '../../hooks/useAuth';
import styled from 'styled-components';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userStatus, eachErrorFlag, authErrorMessage } from '../../store/atom';
import SelectBoxWrapper from '../../components/atoms/SelectBoxWrapper';
import Button from '../../components/atoms/Button';
import ErrorMessageWrapper from '../../components/atoms/ErrorMessageWrapper';
import { useSetionsByDepartmentId, useJobTitle } from '../../hooks/useUser';
import AuthWrapper from '../atoms/AuthWrapper';

interface Props {}

export const NormalUserInvite = (props: Props) => {
  const { registerOrdinaryUser } = useAuthenticate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<number>();
  const [jobTitle, setJobTitle] = useState<number>();
  const user = useRecoilValue(userStatus);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const errorMessage = useRecoilValue(authErrorMessage);
  const { fetchedSections } = useSetionsByDepartmentId(user?.department_id);
  const { fetchedJobTitle } = useJobTitle();

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, section: false, email: false, jobTitle: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const registerUser = {
      name: name,
      email: email,
      department: user.department_id,
      section: selectedSection,
      jobTitle: jobTitle,
    };
    registerOrdinaryUser(registerUser);
  };

  return (
    <>
      <AuthWrapper>
        <NameInput name={name} setName={setName} placeHolder={'氏名'} />
        <Email email={email} setEmail={setEmail} />
        <ErrorMessageWrapper>{errorFlag.section && errorMessage.section[0]}</ErrorMessageWrapper>
        <SelectBoxWrapper
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedSection(Number(e.target.value))
          }
          defaultValue={'choice'}
        >
          <option value="choice" disabled>
            課を選択してください
          </option>
          {fetchedSections?.map((section, index) => (
            <option key={index} value={section.id}>
              {section.name}
            </option>
          ))}
        </SelectBoxWrapper>
        <ErrorMessageWrapper>{errorFlag.jobTitle && errorMessage.jobTitle[0]}</ErrorMessageWrapper>
        <SelectBoxWrapper
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setJobTitle(Number(e.target.value))
          }
          defaultValue={'choice'}
        >
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
      </AuthWrapper>
    </>
  );
};

export default NormalUserInvite;
