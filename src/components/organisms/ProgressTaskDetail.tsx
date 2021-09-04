import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFetchedUnreachedTaskDetail } from '../../hooks/useProgress';
import AdditiveInProgress from '../molecules/AdditiveInProgress';
import RouteInProgress from '../molecules/RouteInProgress';
import Loading from '../atoms/Loading';
import Button from '../atoms/Button';
import BasicInfo from '../molecules/BasicInfo';
import LabelChoice from '../molecules/LabelChoice';
import { useGetTotalLengthOfTaskInProgress } from '../../hooks/useTaskLength';
import { http } from '../../store/atom';
import { useSetRecoilState } from 'recoil';

export const ProgressTaskDetail = (): React.ReactElement => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { unreachedTaskDetail } = useFetchedUnreachedTaskDetail(paramsId);
  const [initialPage, setInitialPage] = useState<number>(1);
  const { actionInProgress } = useGetTotalLengthOfTaskInProgress();
  const [currComponent, setCurrComponent] = useState<string>('basic');
  const setHttpStatus = useSetRecoilState(http);

  const discardOrRetrieve = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let target = e.target as HTMLButtonElement;
    const value = target.value;
    const msg = target.innerHTML;
    if (!confirm(`${msg}しますか？`)) {
      return;
    }
    const res = await actionInProgress(value, paramsId);
    if (!res.isFailure) {
      router.push(`/progress/index/${initialPage}`);
    } else {
      setHttpStatus(res.error.code);
    }
  };

  return (
    <>
      {unreachedTaskDetail?.length > 0 ? (
        <div>
          <LabelChoice
            currComponent={currComponent}
            setCurrComponent={setCurrComponent}
            isComment={false}
          />
          {currComponent === 'basic' ? (
            <BasicInfo
              title={unreachedTaskDetail[0]?.title}
              contents={unreachedTaskDetail[0]?.content}
              editable={false}
            />
          ) : currComponent === 'additive' ? (
            <AdditiveInProgress filename={unreachedTaskDetail[0].filename} taskId={paramsId} />
          ) : (
            <RouteInProgress taskRoute={unreachedTaskDetail} completed={false} />
          )}
          <div>
            <Button onClick={(e) => discardOrRetrieve(e)} background={'light'} value="discard">
              破棄
            </Button>
            <Button onClick={(e) => discardOrRetrieve(e)} marginTop={20} value="retrieve">
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
