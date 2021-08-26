import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useProgress } from '../../hooks/useProgress';
import AdditiveInProgress from '../molecules/AdditiveInProgress';
import RouteInProgress from '../molecules/RouteInProgress';
import Loading from '../atoms/Loading';
import Button from '../atoms/Button';
import BasicInfo from '../molecules/BasicInfo';
import LabelChoice from '../molecules/LabelChoice';

type Task = {
  content: string;
  title: string;
  filename: string;
};

export const ProgressTaskDetail = (): React.ReactElement => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { fetchSelectedTask, actionInProgress } = useProgress();
  const [detailTask, setDetailTask] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [contents, setContents] = useState<string>('');
  const [currComponent, setCurrComponent] = useState<string>('basic');

  useEffect(() => {
    const getTask = async () => {
      const res = await fetchSelectedTask(paramsId);
      setDetailTask(res);
    };
    getTask();
  }, [paramsId]);

  useEffect(() => {
    // 初回の呼び出しではstate値を更新せず、detailTaskを非同期で取得したらstate値を更新する
    if (detailTask.length > 0) {
      setContents(detailTask[0].content);
      setTitle(detailTask[0].title);
    }
  }, [detailTask]);

  const discardOrRetrieve = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    const value = e.currentTarget.innerHTML;
    if (!confirm(`${value}しますか？`)) {
      return;
    }
    if (value === '破棄') {
      actionInProgress('discard', paramsId);
    } else {
      actionInProgress('retrieve', paramsId);
    }
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
            <RouteInProgress taskRoute={detailTask} completed={false} />
          )}
          <div>
            <Button onClick={(e) => discardOrRetrieve(e)} background={'light'}>
              破棄
            </Button>
            <Button onClick={(e) => discardOrRetrieve(e)} marginTop={20}>
              引戻し
            </Button>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ProgressTaskDetail;
