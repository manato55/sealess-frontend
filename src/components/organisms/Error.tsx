import React from 'react';
import styled from 'styled-components';

interface Props {
  errorCode: number;
}

export const Error = (props: Props): React.ReactElement => {
  return (
    <>
      <ErrorMessageWrapper>
        <SubWrapper>
          {props.errorCode === 404 ? (
            <p>Not Found（お探しのページは見つかりませんでした。）</p>
          ) : props.errorCode === 500 ? (
            <p>Server Error（内部エラーによりページを表示できません。再度お試しください。）</p>
          ) : (
            ''
          )}
          <a href="/">トップページへ戻る</a>
        </SubWrapper>
      </ErrorMessageWrapper>
    </>
  );
};

const ErrorMessageWrapper = styled.div`
  position: relative;
  height: 100vh;
`;

const SubWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;

  p {
    font-size: 20px;
    font-weight: bold;
  }

  a {
    color: blue;
    text-decoration: underline;
  }
`;

export default Error;
