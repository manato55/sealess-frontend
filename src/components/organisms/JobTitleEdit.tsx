import { useState, useRef, useEffect } from 'react';
import Select from '../atoms/Select';
import { useJobTitle } from '../../hooks/useUser';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import { useAuthenticate } from '../../hooks/useAuth';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import { eachErrorFlag, authErrorMessage, http } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import router from 'next/router';
import { toast } from 'react-toastify';

interface Props {}

const JobTitleEdit = (props: Props) => {
  const { fetchedJobTitle, changeJobTitle } = useJobTitle();
  const [name, setName] = useState<string>('');
  const [jobTitleId, setJobTitleId] = useState<number>();
  const { removeJobTitle } = useAuthenticate();
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const jobTitleRef = useRef<HTMLSelectElement>(null);
  const [isInputDisabled, setIsInputDiabled] = useState<boolean>(true);
  const setHttpStatus = useSetRecoilState(http);

  const JobTitleChoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const SelectedJobTitle = fetchedJobTitle.find((v) => v.id === Number(e.target.value));
    setName(SelectedJobTitle.name);
    setJobTitleId(SelectedJobTitle.id);
  };

  useEffect(() => {
    if (jobTitleId) {
      setIsInputDiabled(false);
    }
    return () => {
      setErrorFlag({ ...errorFlag, jobTitle: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitleId]);

  const register = async () => {
    if (!confirm('この役職に紐づいているユーザの役職も変更されます。登録しますか？')) {
      return;
    }
    const info = {
      label: '役職',
      name: name,
      jobTitle: jobTitleId,
    };
    setErrorFlag({ ...errorFlag, name: false, jobTitle: false });
    const res = await changeJobTitle(info);
    if (res.status === 200) {
      router.push('/admin/dep-index');
      toast.success('登録完了');
      clear();
    } else if (res.status === 422) {
      setErrorMessage(res.data.errors);
      const isName = res.data.errors.name ? true : false;
      const isJobTitle = res.data.errors.jobTitle ? true : false;
      setErrorFlag({ ...errorFlag, name: isName, jobTitle: isJobTitle });
    } else {
      setHttpStatus(res.status);
    }
  };

  const remove = async () => {
    if (!confirm('選択した役職を削除しますか？')) {
      return;
    }
    await removeJobTitle(jobTitleId);
    clear();
  };

  const clear = () => {
    jobTitleRef.current.value = 'choice';
    setName('');
    setJobTitleId(undefined);
  };

  return (
    <>
      <ErrorMessageWrapper>{errorFlag.jobTitle && errorMessage.jobTitle}</ErrorMessageWrapper>
      <Select defaultValue="choice" onChange={(e) => JobTitleChoice(e)} ref={jobTitleRef}>
        <option value="choice" disabled>
          選択してください
        </option>
        {fetchedJobTitle?.map((v, index) => (
          <option value={v.id} key={index}>
            {v.name}
          </option>
        ))}
      </Select>
      <NameInput
        name={name}
        setName={setName}
        placeHolder={'例）課長'}
        isDisabled={isInputDisabled}
      />
      <Button background={'light'} onClick={() => register()}>
        登録
      </Button>
      <Button marginTop={20} onClick={() => remove()}>
        削除
      </Button>
    </>
  );
};

export default JobTitleEdit;
