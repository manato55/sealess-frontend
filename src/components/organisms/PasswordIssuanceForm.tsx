import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import Button from '../atoms/Button';
import FormWrapper from '../atoms/FormWrapper';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Input from '../atoms/Input';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import { useRecoilValue } from 'recoil';
import { authErrorMessage, eachErrorFlag } from '../../store/atom';

interface Props {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

export const PasswordIssuanceForm = (props: Props): React.ReactElement => {
  const errorMessage = useRecoilValue(authErrorMessage);
  const errorFlag = useRecoilValue(eachErrorFlag);
  const { passwordReRegister } = useAuthenticate();
  const [message, setMessage] = useState<string>('');

  const emailHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      props.setEmail(e.target.value);
    },
    [props],
  );

  const handleSubmit = useCallback(
    async (e: React.ChangeEvent<HTMLFormElement>) => {
      setMessage('');
      e.preventDefault();
      if (!confirm('送信しますか？')) {
        return;
      }
      const res = await passwordReRegister(props.email);
      if (res === 200) {
        setMessage('リンクを付けたメールを送信しました。');
      }
    },
    [props, passwordReRegister],
  );

  return (
    <>
      <FormWrapper>
        {message}
        <ErrorMessageWrapper>{errorFlag.email && errorMessage}</ErrorMessageWrapper>
        <form onSubmit={handleSubmit}>
          <Input type="email" value={props.email} placeholder={'メールアドレス'} onChange={(e) => emailHandler(e)} />
          <Button type="submit">送信</Button>
        </form>
      </FormWrapper>
    </>
  );
};

export default React.memo(PasswordIssuanceForm);
