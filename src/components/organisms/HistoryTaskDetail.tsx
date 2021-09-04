import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCompletedTaskDetail } from '../../hooks/useComplete';
import BasicInfo from '../../components/molecules/BasicInfo';
import AdditiveInProgress from '../../components/molecules/AdditiveInProgress';
import RouteInProgress from '../../components/molecules/RouteInProgress';
import Loading from '../../components/atoms/Loading';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { http, userStatus } from '../../store/atom';
import LabelChoice from '../../components/molecules/LabelChoice';

export const HistoryTaskDetail = (): React.ReactElement => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { completedTaskDetail } = useCompletedTaskDetail(paramsId);
  const [title, setTitle] = useState<string>('');
  const [contents, setContents] = useState<string>('');
  const [currComponent, setCurrComponent] = useState<string>('basic');
  const user = useRecoilValue(userStatus);
  const setHttpStatus = useSetRecoilState(http);

  useEffect(() => {
    // 初回の呼び出しではstate値を更新せず、detailTaskを非同期で取得したらstate値を更新する
    if (completedTaskDetail) {
      if (completedTaskDetail.length > 0) {
        setContents(completedTaskDetail[0].content);
        setTitle(completedTaskDetail[0].title);
      } else {
        setHttpStatus(404);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedTaskDetail]);

  return (
    <>
      {completedTaskDetail?.length > 0 ? (
        <div>
          <LabelChoice
            currComponent={currComponent}
            setCurrComponent={setCurrComponent}
            isComment={false}
          />
          {currComponent === 'basic' ? (
            <BasicInfo title={title} contents={contents} editable={false} />
          ) : currComponent === 'additive' ? (
            <AdditiveInProgress filename={completedTaskDetail[0]?.filename} taskId={paramsId} />
          ) : (
            <RouteInProgress taskRoute={completedTaskDetail} completed={true} />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default HistoryTaskDetail;
