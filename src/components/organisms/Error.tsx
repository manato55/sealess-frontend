import React from 'react';

interface Props {
  errorCode: number;
}

export const Error = (props: Props): React.ReactElement => {
  const back = async () => {
    window.location.href = '/';
  };

  return (
    <>
      {props.errorCode === 404 ? <p>not found</p> : props.errorCode === 500 ? <p>server error</p> : ''}
      <p onClick={() => back()}>topへ戻る</p>
    </>
  );
};

export default Error;
