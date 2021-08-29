import React from 'react';
import Logo from '../atoms/Logo';
import ButtonToggle from '../organisms/ButtonToggle';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { userStatus } from '../../store/atom';

interface Props {}

export const Header = (props: Props): React.ReactElement => {
  const user = useRecoilValue(userStatus);

  return (
    <>
      <StyledHeader>
        {user?.id && <ButtonToggle />}
        <MyInfo>
          {user?.department?.name}
          {user?.section?.name}&nbsp;{user?.name}
        </MyInfo>
        <Logo />
      </StyledHeader>
    </>
  );
};

const StyledHeader = styled.header`
  height: 60px;
  width: 100%;
  background: #1e90ff;
  display: flex;
`;

const MyInfo = styled.div`
  flex: 5;
  text-align: right;
  margin: auto 0;
  font-size: 15px;
`;

export default Header;
