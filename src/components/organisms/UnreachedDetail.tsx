import { useState, useEffect } from 'react';
import { useFetchSelectedUnreachedTask } from '../../hooks/useDraft';
import Loading from '../atoms/Loading';
import BasicInfo from '../molecules/BasicInfo';
import AdditiveInProgress from '../molecules/AdditiveInProgress';
import RouteInProgress from '../molecules/RouteInProgress';
import { useRouter } from 'next/router';
import LabelChoice from '../molecules/LabelChoice';
import { useSetRecoilState } from 'recoil';
import { http } from '../../store/atom';

type SelectedUnreached = {
  title: string;
  content: string;
  filename: string;
};

export const UnreachedTaskDetail = (): React.ReactElement => {
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { selectedUnreachedTask } = useFetchSelectedUnreachedTask(paramsId);
  const [currComponent, setCurrComponent] = useState<string>('basic');

  return (
    <>
      {selectedUnreachedTask ? (
        <div>
          <LabelChoice
            currComponent={currComponent}
            setCurrComponent={setCurrComponent}
            isComment={false}
          />
          {currComponent === 'basic' ? (
            <BasicInfo
              title={selectedUnreachedTask[0]?.title}
              contents={selectedUnreachedTask[0]?.content}
              editable={false}
            />
          ) : currComponent === 'additive' ? (
            <AdditiveInProgress filename={selectedUnreachedTask[0].filename} taskId={paramsId} />
          ) : (
            <RouteInProgress taskRoute={selectedUnreachedTask} completed={false} />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UnreachedTaskDetail;
