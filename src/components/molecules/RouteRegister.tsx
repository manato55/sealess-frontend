import React, { Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Input from '../atoms/Input';
import RouteSetting from './RouteSetting';
import { useRecoilState } from 'recoil';
import { authErrorMessage } from '../../store/atom';

interface Props {
  setRouteLabel: Dispatch<SetStateAction<string>>;
  setPplInRoute: Dispatch<SetStateAction<object>>;
  pplInRoute: object[];
}

export const RouteRegister = (props: Props): React.ReactElement => {
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);

  useEffect(() => {
    return () => {
      setErrorMessage({ ...errorMessage, label: false });
    };
  }, []);

  return (
    <>
      <LinkContainer>
        <Link href="/route-tmpl/registered" passHref>
          <A>登録済み画面へ</A>
        </Link>
      </LinkContainer>
      <ErrorMessageWrapper>{errorMessage.label && errorMessage.label}</ErrorMessageWrapper>
      <p>登録名</p>
      <Input
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setRouteLabel(e.target.value)}
      />
      <br />
      <RouteSetting
        setPplInRoute={props.setPplInRoute}
        pplInRoute={props.pplInRoute}
        process={false}
        isRegisteredRoute={false}
        agentStatus={undefined}
      />
    </>
  );
};

const A = styled.a`
  text-decoration: underline;
  color: blue;
`;

const LinkContainer = styled.div`
  text-align: right;
`;

export default RouteRegister;
