import React, { Dispatch, SetStateAction, useCallback } from 'react';
import Button from '../atoms/Button';
import FormWrapper from '../atoms/FormWrapper';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import styled from 'styled-components';
import Link from 'next/link';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authErrorMessage, http, userStatus } from '../../store/atom';
import RegisterCommonForm from '../molecules/RegisterCommonForm';
import { useLoginCheck } from '../../hooks/useAuth';
import router from 'next/router';

interface Props {
  email: string;
  password: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
}

export const LoginForm = (props: Props): React.ReactElement => {
  const { login } = useLoginCheck();
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const setHttpStatus = useSetRecoilState(http);
  const setUser = useSetRecoilState(userStatus);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    setErrorMessage({ ...errorMessage, general: null });
    e.preventDefault();
    const user = {
      email: props.email,
      password: props.password,
    };
    const res = await login(user);
    if (!res.isFailure) {
      setUser(res.value.user);
      localStorage.setItem('token', res.value.token);
      // user種別に応じて遷移先を変更
      switch (res.value.user.user_type) {
        case 0:
          router.push('/admin');
          break;
        case 1:
          router.push('/dep-admin');
          break;
        case 2:
          router.push('/');
          break;
        case 99:
          router.push('/owner');
          break;
      }
    } else {
      if (res.error.code == 422) {
        setErrorMessage({ ...errorMessage, general: res.error.message });
      } else {
        setHttpStatus(res.error.code);
      }
    }
  };

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
