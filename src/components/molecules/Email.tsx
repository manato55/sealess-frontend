import { Dispatch, SetStateAction } from 'react';
import Input from '../atoms/Input';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import { useRecoilValue } from 'recoil';
import { authErrorMessage, eachErrorFlag } from '../../store/atom';

type Props = {
  setEmail: Dispatch<SetStateAction<string>>;
  email: string;
};

export const Email = (props: Props): React.ReactElement => {
  const errorMessage = useRecoilValue(authErrorMessage);
  const errorFlag = useRecoilValue(eachErrorFlag);

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    props.setEmail(e.target.value);
  };

  return (
    <>
      <div>
        <ErrorMessageWrapper>{errorFlag.email && errorMessage.email[0]}</ErrorMessageWrapper>
        <Input
          type="email"
          value={props.email}
          onChange={(e) => emailHandler(e)}
          placeholder="メールアドレス"
        />
      </div>
    </>
  );
};

export default Email;
