import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  path: string;
  tagName: string;
  pathMatch?: string;
}

export const Label = (props: Props): React.ReactElement => {
  const router = useRouter();
  const [currentPathname, setCurrentPathname] = useState<string>('');

  useEffect(() => {
    setCurrentPathname(router.pathname);
  }, [router.pathname]);

  return (
    <>
      <Link href={props.path}>
        <a>
          {currentPathname.match(props.pathMatch || `${props.path}*`) ? (
            <CurrentTab>{props.tagName}</CurrentTab>
          ) : (
            <p>{props.tagName}</p>
          )}
        </a>
      </Link>
    </>
  );
};

const CurrentTab = styled.p`
  background: #1e90ff;
`;

export default React.memo(Label);
