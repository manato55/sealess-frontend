import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import Select from '../atoms/Select';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import { useAuthenticate } from '../../hooks/useAuth';
import { useDepartment } from '../../hooks/useCompany';
import { eachErrorFlag, authErrorMessage, http } from '../../store/atom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

interface Props {
  setSection: Dispatch<SetStateAction<string>>;
  section: string;
}

const SecRegistryForm = (props: Props) => {
  const { sectionRegistry } = useAuthenticate();
  const { fetchedDepartment } = useDepartment();
  const [departmentId, setDepartmentId] = useState<number>();
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const errorMessage = useRecoilValue(authErrorMessage);
  const setHttpStatus = useSetRecoilState(http);
  const setErrorMessage = useSetRecoilState(authErrorMessage);

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
      label: '課名',
      name: props.section,
      department: departmentId,
    };
    setErrorFlag({ ...errorFlag, name: false, department: false });
    const res = await sectionRegistry(Info);
    if (!res.isFailure) {
      toast.success('登録完了');
    } else {
      if (res.error.code === 422) {
        setErrorMessage(res.error.message);
        setErrorFlag({
          ...errorFlag,
          name: res.error.message.name,
          department: res.error.message.department,
        });
      } else {
        setHttpStatus(res.error.code);
      }
    }
  };

  return (
    <>
      <ErrorMessageWrapper>
        {errorFlag.department && errorMessage.department[0]}
      </ErrorMessageWrapper>
      <Select
        defaultValue="choice"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setDepartmentId(Number(e.target.value))
        }
      >
        <option value="choice" disabled>
          選択してください
        </option>
        {fetchedDepartment?.map((dep, index) => (
          <option value={dep.id} key={index}>
            {dep.name}
          </option>
        ))}
      </Select>
      <NameInput name={props.section} setName={props.setSection} placeHolder={'例) 〇〇課'} />
      <Button onClick={() => submit()}>登録</Button>
    </>
  );
};

export default SecRegistryForm;
