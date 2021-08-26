import React, { Dispatch, SetStateAction, useCallback, useState, useEffect } from 'react';
import Button from '../atoms/Button';
import FormWrapper from '../atoms/FormWrapper';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Input from '../atoms/Input';
import { useAuthenticate } from '../../hooks/useAuth';
import { useRecoilValue, useRecoilState } from 'recoil';
import { authErrorMessage, eachErrorFlag } from '../../store/atom';
import styled from 'styled-components';
import Link from 'next/link';

interface Props {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

export const PasswordIssuanceForm = (props: Props): React.ReactElement => {
  const errorMessage = useRecoilValue(authErrorMessage);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const { passwordReRegister } = useAuthenticate();
  const [message, setMessage] = useState<string>('');

  const emailHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      props.setEmail(e.target.value);
    },
    [props]
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
    [props, passwordReRegister]
  );

  return (
    <>
      <FormWrapper>
        {message}
        <ErrorMessageWrapper>{errorFlag.email && errorMessage}</ErrorMessageWrapper>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            value={props.email}
            placeholder={'メールアドレス'}
            onChange={(e) => emailHandler(e)}
          />
          <Button type="submit">送信</Button>
        </form>
        <LoginLink>
          <Link href="/login" passHref>
            <A>ログイン画面</A>
          </Link>
        </LoginLink>
      </FormWrapper>
    </>
  );
};

const LoginLink = styled.div`
  margin-top: 10px;
  text-align: left;
`;

const A = styled.a`
  text-decoration: underline;
  color: blue;
`;

export default React.memo(PasswordIssuanceForm);
