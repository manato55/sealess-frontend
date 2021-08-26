import {useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { http, authErrorMessage, eachErrorFlag } from '../../store/atom';
import { useSetRecoilState, useRecoilState } from 'recoil';
import styled from 'styled-components'
import UserRegisterWrapper from '../atoms/UserRegisterWrapper';
import NameInput from '../molecules/NameInput';
import Button from '../atoms/Button';
import {useAuthenticate} from '../../hooks/useAuth'
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper'
import {useDepSecIndex} from '../../hooks/useUser'


const SectionEdit = () => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const setHttpStatus = useSetRecoilState(http)
  const [name, setName] = useState<string>('')
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag)
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const { deleteThisSec, changeSecName } = useAuthenticate();
  const { depSecIndex } = useDepSecIndex();
  const [department, setDepartment] = useState<{name: string, id: number}>()


  useEffect(() => {
    if (depSecIndex) {
      let extractedSec = [];
      depSecIndex.map((i, index) => {
        let check = i.sections.find(v => v.id === paramsId);
        if (check) {
          extractedSec.push(check)
        }
      })

      if (!extractedSec) {
        setHttpStatus(404);
        return;
      }
      setName(extractedSec[0].name);
      setDepartment(depSecIndex.find(v => v.id === extractedSec[0].department_id))
    } else {
      router.push('/admin/dep-index');
    }
    return () => {
      setErrorMessage({ ...errorMessage, general: null });
      setErrorFlag({ ...errorFlag, name: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depSecIndex]);

  const submit = () => {
    if (!confirm('この課に紐づくユーザーの課も変更となります。登録しますか？')) {
      return;
    }
    const SecInfo = {
      label: '課名',
      section_id: paramsId,
      department_id: department.id,
      name: name,
    };
    changeSecName(SecInfo);
  };


  return (
    <>
      <DeleteBtnWrapper>
        <span onClick={() => deleteThisSec(paramsId)}>この課を削除する</span>
      </DeleteBtnWrapper>
      <UserRegisterWrapper>
        <ErrorMessageWrapper>{errorMessage.general && errorMessage.general}</ErrorMessageWrapper>
        <p>{department?.name}</p>
        <NameInput name={name} setName={setName} placeHolder={'〇〇課'} />
        <Button onClick={submit} marginTop={20}>
          登録
        </Button>
      </UserRegisterWrapper>
    </>
  )
}


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

export default SectionEdit
