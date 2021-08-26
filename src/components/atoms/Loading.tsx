import React from 'react';
import styled from 'styled-components';

export const Loading = (): React.ReactElement => {
  return (
    <LoadingWrapper>
      <div>Loading...</div>
    </LoadingWrapper>
  );
};

const LoadingWrapper = styled.div`
  position: relative;
  height: 100vh;

  div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;
  }
`;

export default Loading;
