import { Dispatch, SetStateAction, useEffect } from 'react';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import { useAuthenticate } from '../../hooks/useAuth';
import { authErrorMessage, eachErrorFlag, http } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

interface Props {
  jobTitle: string;
  setJobTitle: Dispatch<SetStateAction<string>>;
}

const JobTitleRegistryForm = (props: Props) => {
  const { jobTitleRegistry } = useAuthenticate();
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const setErrorMessage = useSetRecoilState(authErrorMessage);
  const setHttpStatus = useSetRecoilState(http);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const Info = {
      label: '役職名',
      name: props.jobTitle,
    };
    setErrorFlag({ ...errorFlag, name: false });
    const res = await jobTitleRegistry(Info);
    if (!res.isFailure) {
      toast.success('登録完了');
    } else {
      if (res.error.code === 422) {
        setErrorMessage(res.error.message);
        setErrorFlag({ ...errorFlag, name: res.error.message.name });
      } else {
        setHttpStatus(res.error.code);
      }
    }
  };

  return (
    <>
      <NameInput name={props.jobTitle} setName={props.setJobTitle} placeHolder={'例) 課長'} />
      <Button onClick={() => submit()}>登録</Button>
    </>
  );
};

export default JobTitleRegistryForm;
