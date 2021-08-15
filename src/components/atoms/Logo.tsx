import styled from 'styled-components';
import React from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { userStatus } from '../../store/atom';

const Logo = (): React.ReactElement => {
  const user = useRecoilValue(userStatus);

  return (
    <StyledLogo>
      {user?.id ? (
        <Link href="/">
          <a>app</a>
        </Link>
      ) : (
        <span>app</span>
      )}
    </StyledLogo>
  );
};

const StyledLogo = styled.div`
  margin: auto 0;
  padding-right: 10px;
  font-size: 24px;
  text-align: right;
  flex: 1;
`;

export default React.memo(Logo);
