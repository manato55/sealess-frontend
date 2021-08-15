import React, { Dispatch, SetStateAction, useCallback } from 'react';
import Button from '../atoms/Button';
import FormWrapper from '../atoms/FormWrapper';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import styled from 'styled-components';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { authErrorMessage } from '../../store/atom';
import RegisterCommonForm from '../molecules/RegisterCommonForm';

interface Props {
  email: string;
  password: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
}

type User = {
  email: string;
  password: string;
};

export const LoginForm = (props: Props): React.ReactElement => {
  const errorMessage = useRecoilValue(authErrorMessage);
  const { login } = useAuthenticate();

  const handleSubmit = useCallback(
    (e: React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      const user: User = {
        email: props.email,
        password: props.password,
      };
      login(user);
    },
    [props, login],
  );

  return (
    <>
      <FormWrapper>
        <ErrorMessageWrapper>{errorMessage.general && errorMessage.general[0]}</ErrorMessageWrapper>
        <form onSubmit={handleSubmit}>
          <RegisterCommonForm
            email={props.email}
            setEmail={props.setEmail}
            password={props.password}
            setPassword={props.setPassword}
          />
          <Button type="submit">ログイン</Button>
          <PassIssuanceLink>
            <Link href="/password-issuance" passHref>
              <A>パスワード再発行</A>
            </Link>
          </PassIssuanceLink>
        </form>
      </FormWrapper>
    </>
  );
};

const PassIssuanceLink = styled.div`
  margin-top: 10px;
  text-align: left;
`;

const A = styled.a`
  text-decoration: underline;
  color: blue;
`;

export default React.memo(LoginForm);
