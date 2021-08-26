import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate } from '../../hooks/useAuth';
import { userStatus, eachErrorFlag, authErrorMessage, http } from '../../store/atom';
import SelectBoxWrapper from '../atoms/SelectBoxWrapper';
import Email from '../molecules/Email';
import NameInput from '../molecules/NameInput';
import { SECTION, JOBTITLE } from '../../const/JobInfo';
import Button from '../atoms/Button';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import styled from 'styled-components';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { useUser } from '../../hooks/useUser';
import UserRegisterWrapper from '../atoms/UserRegisterWrapper';

interface Props {}

type User = {
  userid: number;
  name: string;
  email: string;
  department: string;
  section: string;
  jobTitle: string;
};

const EditNormalUser = (props: Props) => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { editOrdinaryUserInfo, deleteDepUser } = useAuthenticate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [section, setSection] = useState<string[]>();
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const user = useRecoilValue(userStatus);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const errorMessage = useRecoilValue(authErrorMessage);
  const sectionRef = useRef(null);
  const jobTitleRef = useRef(null);
  const setHttpStatus = useSetRecoilState(http);
  const { depUser } = useUser();

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
    return () => {
      setErrorFlag({ ...errorFlag, name: false, email: false, section: false, department: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (depUser && section) {
      const extractedUser = depUser.find((v) => v.id === paramsId);
      // useridを直打ちしてきた場合はNOT FOUNDへ遷移
      if (!extractedUser) {
        setHttpStatus(404);
        return;
      }
      setName(extractedUser.name);
      setEmail(extractedUser.email);
      setSelectedSection(extractedUser.section);
      setJobTitle(extractedUser.job_title);
      sectionRef.current.value = extractedUser.section;
      jobTitleRef.current.value = extractedUser.job_title;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depUser, section]);

  const secChoice = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const choiceSec: string = e.target.value;
    setSelectedSection(choiceSec);
  };

  const submit = () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const editUserInfo: User = {
      userid: paramsId,
      name: name,
      email: email,
      department: user.department,
      section: selectedSection,
      jobTitle: jobTitle,
    };
    editOrdinaryUserInfo(editUserInfo);
  };

  return (
    <>
      <DeleteBtnWrapper>
        <span onClick={() => deleteDepUser(paramsId)}>このユーザーを削除する</span>
      </DeleteBtnWrapper>
      <UserRegisterWrapper>
        <NameInput name={name} setName={setName} placeHolder={'氏名'} />
        <Email email={email} setEmail={setEmail} />
        <ErrorMessageWrapper>{errorFlag.section && errorMessage.section[0]}</ErrorMessageWrapper>
        <SelectBoxWrapper onChange={(e) => secChoice(e)} defaultValue={'choice'} ref={sectionRef}>
          <option value="choice" disabled>
            課を選択してください
          </option>
          {section &&
            section.map((v, index) => (
              <option key={index} value={v}>
                {v}
              </option>
            ))}
        </SelectBoxWrapper>
        <ErrorMessageWrapper>{errorFlag.jobTitle && errorMessage.jobTitle[0]}</ErrorMessageWrapper>
        <SelectBoxWrapper
          onChange={(e) => setJobTitle(e.target.value)}
          defaultValue={'choice'}
          ref={jobTitleRef}
        >
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
