import { Dispatch, SetStateAction, useEffect } from 'react';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import { useAuthenticate } from '../../hooks/useAuth';
import { eachErrorFlag } from '../../store/atom';
import { useRecoilState } from 'recoil';

interface Props {
  jobTitle: string;
  setJobTitle: Dispatch<SetStateAction<string>>;
}

const JobTitleRegistryForm = (props: Props) => {
  const { jobTitleRegistry } = useAuthenticate();
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const Info = {
      label: '役職名',
      name: props.jobTitle,
    };
    jobTitleRegistry(Info);
  };

  return (
    <>
      <NameInput name={props.jobTitle} setName={props.setJobTitle} placeHolder={'例) 課長'} />
      <Button onClick={() => submit()}>登録</Button>
    </>
  );
};

export default JobTitleRegistryForm;
