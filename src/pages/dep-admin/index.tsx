import React, { useEffect, useState } from 'react';
import Email from '../../components/molecules/Email';
import NameInput from '../../components/molecules/NameInput';
import { SECTION, JOBTITLE } from '../../const/JobInfo';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { userStatus, eachErrorFlag, authErrorMessage } from '../../store/atom';
import SelectBoxWrapper from '../../components/atoms/SelectBoxWrapper';
import Button from '../../components/atoms/Button';
import ErrorMessageWrapper from '../../components/atoms/ErrorMessageWrapper';

type User = {
  name: string;
  email: string;
  department: string;
  section: string;
  jobTitle: string;
};

export const DepAdmin = (): React.ReactElement => {
  const { registerOrdinaryUser } = useAuthenticate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [section, setSection] = useState<string[]>();
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const user = useRecoilValue(userStatus);
  const errorFlag = useRecoilValue(eachErrorFlag);
  const errorMessage = useRecoilValue(authErrorMessage);

  useEffect(() => {
    if (user?.id) {
      switch (user.department) {
        case '経営企画部':
          setSection(SECTION.management);
          break;
        case '開発部':
          setSection(SECTION.dev);
          break;
      }
    }
  }, [user]);

  const secChoice = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const choiceSec: string = e.target.value;
    setSelectedSection(choiceSec);
  };

  const submit = async () => {
    const registerUser: User = {
      name: name,
      email: email,
      department: user.department,
      section: selectedSection,
      jobTitle: jobTitle,
    };
    await registerOrdinaryUser(registerUser);
  };

  return (
    <Wrapper>
      <NameInput name={name} setName={setName} />
      <Email email={email} setEmail={setEmail} />
      <ErrorMessageWrapper>{errorFlag.section && errorMessage.section[0]}</ErrorMessageWrapper>
      <SelectBoxWrapper onChange={(e) => secChoice(e)} defaultValue={'choice'}>
        <option value="choice" disabled>
          課を選択してください
        </option>
        {section !== undefined &&
          section.map((v, index) => (
            <option key={index} value={v}>
              {v}
            </option>
          ))}
      </SelectBoxWrapper>
      <ErrorMessageWrapper>{errorFlag.jobTitle && errorMessage.jobTitle[0]}</ErrorMessageWrapper>
      <SelectBoxWrapper onChange={(e) => setJobTitle(e.target.value)} defaultValue={'choice'}>
        <option value="choice" disabled>
          役職を選択してください
        </option>
        {JOBTITLE.map((v, index) => (
          <option key={index} value={v}>
            {v}
          </option>
        ))}
      </SelectBoxWrapper>
      <Button onClick={submit} marginTop={20}>
        登録
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  text-align: center;
  border: 0px black solid;
  width: 80%;
  margin: 100px auto;
  padding: 40px;
  border-radius: 10px;
  background-color: gainsboro;
`;

export default DepAdmin;
