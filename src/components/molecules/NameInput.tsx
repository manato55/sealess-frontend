import React, { Dispatch, SetStateAction } from 'react';
import Input from '../atoms/Input';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import { useRecoilValue } from 'recoil';
import { authErrorMessage, eachErrorFlag } from '../../store/atom';

interface Props {
  setName: Dispatch<SetStateAction<string>>;
  name: string;
}

export const FullName = (props: Props) => {
  const errorMessage = useRecoilValue(authErrorMessage);
  const errorFlag = useRecoilValue(eachErrorFlag);

  return (
    <>
      <ErrorMessageWrapper>{errorFlag.name && errorMessage.name[0]}</ErrorMessageWrapper>
      <Input type="text" value={props.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setName(e.target.value)} placeholder="氏名" />
    </>
  );
};

export default FullName;
