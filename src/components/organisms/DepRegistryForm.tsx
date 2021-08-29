import { Dispatch, SetStateAction, useEffect } from 'react';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import { useAuthenticate } from '../../hooks/useAuth';
import { eachErrorFlag } from '../../store/atom';
import { useRecoilState } from 'recoil';

interface Props {
  setDepartment: Dispatch<SetStateAction<string>>;
  department: string;
}

const DepRegistryForm = (props: Props) => {
  const { departmentRegistry } = useAuthenticate();
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);

  useEffect(() => {
    return () => {
      setErrorFlag({ ...errorFlag, name: false, department: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    if (!confirm('登録しますか？')) {
      return;
    }
    const Info = {
      label: '部名',
      name: props.department,
    };
    departmentRegistry(Info);
  };

  return (
    <>
      <NameInput name={props.department} setName={props.setDepartment} placeHolder={'例) 〇〇部'} />
      <Button onClick={() => submit()}>登録</Button>
    </>
  );
};

export default DepRegistryForm;
