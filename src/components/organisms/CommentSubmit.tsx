import React, { useState } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { useRouter } from 'next/router';
import Button from '../atoms/Button';
import AddedComment from '../molecules/AddedComment';
import { authErrorMessage, http, eachErrorFlag } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';

export const CommentSubmit = (): React.ReactElement => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const [comment, setComment] = useState<string>();
  const { returnToDrafter } = useProgress();
  const setHttpStatus = useSetRecoilState(http);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);

  const submit = async () => {
    if (!confirm('提出しますか？')) {
      return;
    }
    const data: {
      id: number;
      comment: string;
    } = {
      id: paramsId,
      comment: comment,
    };
    setErrorMessage({ ...errorMessage, general: false });
    const res = await returnToDrafter(data);
    if (!res.isFailure) {
      router.push('/recieve');
    } else {
      if (res.error.code === 422) {
        setErrorMessage({ ...errorMessage, general: res.error.message.comment });
      } else {
        setHttpStatus(res.status);
      }
    }
  };

  return (
    <>
      <AddedComment setComment={setComment} />
      <Button onClick={() => submit()} marginTop={20}>
        提出
      </Button>
    </>
  );
};

export default CommentSubmit;
