import React, { Dispatch, SetStateAction } from 'react';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import TextArea from '../atoms/TextArea';
import { useRecoilState } from 'recoil';
import { authErrorMessage } from '../../store/atom';
import { useEffect } from 'react';

interface Props {
  setComment: Dispatch<SetStateAction<string>>;
}

export const AddedComment = (props: Props): React.ReactElement => {
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);

  useEffect(() => {
    return () => {
      setErrorMessage({ ...errorMessage, general: false });
    };
  }, []);

  return (
    <>
      <ErrorMessageWrapper>{errorMessage.general && errorMessage.general}</ErrorMessageWrapper>
      <p>返却コメント</p>
      <TextArea onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => props.setComment(e.target.value)}></TextArea>
    </>
  );
};

export default AddedComment;
