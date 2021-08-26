import styled from 'styled-components';

export default function Custom404() {
  return (
    <ErrorMessageWrapper>
      <SubWrapper>
        <p>Not Found（お探しのページは見つかりませんでした。）</p>
        <a href="/">トップページへ戻る</a>
      </SubWrapper>
    </ErrorMessageWrapper>
  );
}

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
