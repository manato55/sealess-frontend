import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useComplete } from '../../hooks/useComplete';
import BasicInfo from '../../components/molecules/BasicInfo';
import AdditiveInProgress from '../../components/molecules/AdditiveInProgress';
import RouteInProgress from '../../components/molecules/RouteInProgress';
import Loading from '../../components/atoms/Loading';
import { useRecoilValue } from 'recoil';
import { userStatus } from '../../store/atom';
import LabelChoice from '../../components/molecules/LabelChoice';
import Button from '../../components/atoms/Button';

type Task = {
  title: string;
  content: string;
  filename: string;
  user_id: number;
};

export const HistoryTaskDetail = (): React.ReactElement => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { fetchCompletetTaskDetail, discardTask } = useComplete();
  const [title, setTitle] = useState<string>('');
  const [contents, setContents] = useState<string>('');
  const [currComponent, setCurrComponent] = useState<string>('basic');
  const user = useRecoilValue(userStatus);
  const [detailTask, setDetailTask] = useState<Task[]>();

  useEffect(() => {
    const getTask = async () => {
      const res = await fetchCompletetTaskDetail(paramsId);
      setDetailTask(res);
    };
    getTask();
  }, [paramsId]);

  useEffect(() => {
    // 初回の呼び出しではstate値を更新せず、detailTaskを非同期で取得したらstate値を更新する
    if (detailTask?.length > 0) {
      setContents(detailTask[0].content);
      setTitle(detailTask[0].title);
    }
  }, [detailTask]);

  const discard = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    const value = e.currentTarget.innerHTML;
    if (!confirm(`${value}しますか？`)) {
      return;
    }
    discardTask(paramsId);
  };

  return (
    <>
      {detailTask?.length > 0 ? (
        <div>
          <LabelChoice
            currComponent={currComponent}
            setCurrComponent={setCurrComponent}
            isComment={false}
          />
          {currComponent === 'basic' ? (
            <BasicInfo title={title} contents={contents} editable={false} />
          ) : currComponent === 'additive' ? (
            <AdditiveInProgress filename={detailTask[0].filename} taskId={paramsId} />
          ) : (
            <RouteInProgress taskRoute={detailTask} completed={true} />
          )}
          <br />
          <div>
            {detailTask[0].user_id === user.id && (
              <Button onClick={(e) => discard(e)} marginTop={20}>
                破棄
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default HistoryTaskDetail;
