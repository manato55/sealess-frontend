import { Dispatch, SetStateAction, useEffect } from 'react';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import { useAuthenticate } from '../../hooks/useAuth';
import { authErrorMessage, eachErrorFlag, http } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

interface Props {
  setDepartment: Dispatch<SetStateAction<string>>;
  department: string;
}

const DepRegistryForm = (props: Props) => {
  const { departmentRegistry } = useAuthenticate();
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const setErrorMessage = useSetRecoilState(authErrorMessage);
  const setHttpStatus = useSetRecoilState(http);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, department: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const Info = {
      label: '部名',
      name: props.department,
    };
    setErrorFlag({ ...errorFlag, name: false });
    const res = await departmentRegistry(Info);
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
      <NameInput name={props.department} setName={props.setDepartment} placeHolder={'例) 〇〇部'} />
      <Button onClick={() => submit()}>登録</Button>
    </>
  );
};

export default DepRegistryForm;
