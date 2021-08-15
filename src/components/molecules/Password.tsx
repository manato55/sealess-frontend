import { Dispatch, SetStateAction, useCallback } from 'react';
import Input from '../atoms/Input';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authErrorMessage, eachErrorFlag } from '../../store/atom';

interface Props {
  setPassword: Dispatch<SetStateAction<string>>;
  password: string;
}

export const Password = (props: Props): React.ReactElement => {
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);
  const errorFlag = useRecoilValue(eachErrorFlag);

  const passwordHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      props.setPassword(e.target.value);
    },
    [props],
  );

  return (
    <div>
      <ErrorMessageWrapper>{errorFlag.password && errorMessage.password[0]}</ErrorMessageWrapper>
      <Input type="password" value={props.password} onChange={(e) => passwordHandler(e)} placeholder="パスワード" />
    </div>
  );
};

export default Password;
