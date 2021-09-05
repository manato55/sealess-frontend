import React, { useEffect, useState } from 'react';
import Email from '../../components/molecules/Email';
import NameInput from '../../components/molecules/NameInput';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { userStatus, eachErrorFlag, authErrorMessage, http } from '../../store/atom';
import SelectBoxWrapper from '../../components/atoms/SelectBoxWrapper';
import Button from '../../components/atoms/Button';
import ErrorMessageWrapper from '../../components/atoms/ErrorMessageWrapper';
import { useSetionsByDepartmentId, useJobTitle, useDepAdmin } from '../../hooks/useCompany';
import AuthWrapper from '../atoms/AuthWrapper';
import { toast } from 'react-toastify';

interface Props {}

export const NormalUserInvite = (props: Props) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<number>();
  const [jobTitle, setJobTitle] = useState<number>();
  const user = useRecoilValue(userStatus);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const setHttpStatus = useSetRecoilState(http);
  const { fetchedSections } = useSetionsByDepartmentId(user?.department_id);
  const { fetchedJobTitle } = useJobTitle();
  const { inviteNormalUser } = useDepAdmin();

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, section: false, email: false, jobTitle: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const info = {
      name: name,
      email: email,
      department: user.department_id,
      section: selectedSection,
      jobTitle: jobTitle,
    };
    setErrorFlag({ ...errorFlag, name: false, section: false, email: false, jobTitle: false });
    const res = await inviteNormalUser(info);
    if (!res.isFailure) {
      toast.success('招待メールを送信しました。');
    } else {
      if (res.error.code === 422) {
        setErrorMessage(res.error.message);
        setErrorFlag({
          ...errorFlag,
          jobTitle: res.error.message.jobTitle,
          name: res.error.message.name,
          section: res.error.message.section,
          email: res.error.message.email,
        });
      } else {
        setHttpStatus(res.error.code);
      }
    }
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
