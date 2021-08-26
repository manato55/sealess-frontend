import styled from 'styled-components';

export default function Custom500() {
  return (
    <ErrorMessageWrapper>
      <SubWrapper>
        <p>Server Error（内部エラーによりページを表示できません。再度お試しください。）</p>
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
