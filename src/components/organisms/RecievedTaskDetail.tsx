import React, { useEffect, useState } from 'react';
import BasicInfo from '../molecules/BasicInfo';
import { useRouter } from 'next/router';
import AdditiveInProgress from '../molecules/AdditiveInProgress';
import RouteInProgress from '../molecules/RouteInProgress';
import styled from 'styled-components';
import Link from 'next/link';
import { useSetRecoilState } from 'recoil';
import { http } from '../../store/atom';
import { useProgress } from '../../hooks/useProgress';
import LabelChoice from '../molecules/LabelChoice';
import Button from '../atoms/Button';

export const RecievedTaskDetail = (): React.ReactElement => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { actionInEscalation } = useProgress();
  const [extracedTask, setExtractedTask] = useState<any>();
  const [currComponent, setCurrComponent] = useState<string>('basic');
  const setHttpStatus = useSetRecoilState(http);
  const { recievedTask } = useProgress();

  useEffect(() => {
    if (recievedTask?.length > 0) {
      const task = recievedTask.find((v) => v.id === paramsId);
      if (!task) {
        setHttpStatus(404);
        return;
      }
      setExtractedTask(task);
      // 受信案件を一件ももたないユーザーがパラメータ直入力した場合を想定
    } else {
      setHttpStatus(404);
      return;
    }
  }, [recievedTask, paramsId, setHttpStatus]);

  const approveOrReturn = async () => {
    if (!confirm('承認しますか？')) {
      return;
    }
    const res = await actionInEscalation('approve', paramsId);
    if (!res.isFailure) {
      router.push('/recieve');
    } else {
      setHttpStatus(res.status);
    }
  };

  return (
    <>
      {extracedTask && (
        <div>
          <LabelChoice
            currComponent={currComponent}
            setCurrComponent={setCurrComponent}
            isComment={false}
          />
          {currComponent === 'basic' ? (
            <BasicInfo
              title={extracedTask.title}
              contents={extracedTask.content}
              editable={false}
            />
          ) : currComponent === 'additive' ? (
            <AdditiveInProgress filename={extracedTask.filename} taskId={paramsId} />
          ) : (
            <RouteInProgress taskRoute={[extracedTask]} completed={false} />
          )}
          <div>
            <Button onClick={() => approveOrReturn()} marginTop={20}>
              承認
            </Button>
            <Link href={`/recieve/${paramsId}/comment`} passHref>
              <ToCommentPage>差戻し画面へ</ToCommentPage>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

const ToCommentPage = styled.a`
  text-decoration: underline;
  color: blue;
  margin-top: 30px;
  display: inline-block;
`;

export default RecievedTaskDetail;
