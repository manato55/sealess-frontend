import React, { Dispatch, SetStateAction, useCallback, useState, useEffect } from 'react';
import Button from '../atoms/Button';
import FormWrapper from '../atoms/FormWrapper';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Input from '../atoms/Input';
import { useAuthenticate } from '../../hooks/useAuth';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { authErrorMessage, eachErrorFlag, http } from '../../store/atom';
import styled from 'styled-components';
import Link from 'next/link';

interface Props {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

export const PasswordIssuanceForm = (props: Props): React.ReactElement => {
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const setHttpStatus = useSetRecoilState(http);
  const { passwordIssuanceMail } = useAuthenticate();
  const [message, setMessage] = useState<string>('');

  const emailHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      props.setEmail(e.target.value);
    },
    [props]
  );

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    setMessage('');
    e.preventDefault();
    if (!confirm('送信しますか？')) {
      return;
    }
    setErrorFlag({ ...errorFlag, email: false });
    const res = await passwordIssuanceMail(props.email);
    if (!res.isFailure) {
      setMessage('リンクを付けたメールを送信しました。');
    } else {
      if (res.error.code === 422) {
        setErrorMessage(res.error.message);
        setErrorFlag({ ...errorFlag, email: true });
      } else {
        setHttpStatus(res.error.code);
      }
    }
  };

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
