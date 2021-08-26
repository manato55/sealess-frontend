import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { userStatus } from '../../store/atom';

const Logo = (): React.ReactElement => {
  const user = useRecoilValue(userStatus);
  const [homePath, setHomePath] = useState<string>('');

  useEffect(() => {
    if (user) {
      switch (user.user_type) {
        case 0:
          setHomePath('/admin');
          break;
        case 1:
          setHomePath('/dep-admin');
          break;
        case 2:
          setHomePath('/');
          break;
      }
    }
  }, [user]);

  return (
    <StyledLogo>
      {user?.id ? (
        <Link href={homePath}>
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
