import React from 'react';
import Header from '../molecules/Header';
import LeftNav from '../organisms/LeftNav';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { isNavToggle, userStatus, http } from '../../store/atom';
import { Slide } from '@material-ui/core';
import Error from '../organisms/Error';

interface Props {
  children: React.ReactNode;
}

export const BasicLayout = (props: Props) => {
  const isNav = useRecoilValue(isNavToggle);
  const user = useRecoilValue(userStatus);
  const httpStatusCode = useRecoilValue(http);

  return (
    <>
      <Header />
      {httpStatusCode ? (
        <Error errorCode={httpStatusCode} />
      ) : (
        <ContentWrapper>
          {user?.id && (
            <Slide in={isNav} direction="right" unmountOnExit mountOnEnter>
              <NavWrapper>
                <LeftNav />
              </NavWrapper>
            </Slide>
          )}
          <BodyWrapper>{props.children}</BodyWrapper>
        </ContentWrapper>
      )}
    </>
  );
};

const ContentWrapper = styled.div`
  display: flex;
`;

const NavWrapper = styled.div`
  flex: 2;
  background: gainsboro;
  max-width: 200px;
`;

const BodyWrapper = styled.div`
  flex: 8;
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 10px;
`;

export default BasicLayout;
