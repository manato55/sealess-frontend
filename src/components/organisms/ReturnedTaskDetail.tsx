import React, { useEffect, useState, useRef } from 'react';
import { useReturnedTask } from '../../hooks/useReturnedTask';
import { useDraft } from '../../hooks/useDraft';
import Loading from '../atoms/Loading';
import { useRouter } from 'next/router';
import BasicInfo from '../molecules/BasicInfo';
import Additives from '../molecules/Additives';
import Routing from '../molecules/RouteSetting';
import Comment from '../molecules/Comment';
import LabelChoice from '../molecules/LabelChoice';
import Button from '../atoms/Button';
import DraftValidationError from '../molecules/DraftValidataionError';

type Draft = {
  title: string;
  content: string;
  file: File[];
  ppl: object[];
  action: string;
  id: number;
};

type Agent = {
  route: string;
  user: {
    name: string;
    id: number;
    department: string;
    section: string;
  };
  agent_user: number;
};

type RD = {
  title: string;
  content: string;
  returned_task?: {
    comment: string;
  };
  process: string;
  filename: string;
  id: number;
  agent_statuses: {
    route: string;
    user: {
      name: string;
      id: number;
      department: string;
      section: string;
    };
    agent_user: number;
  }[];
};

export const ReturnedTaskDetail = (): React.ReactElement => {
  const { fetchReturnedDetail, discardReturnedTask } = useReturnedTask();
  const { registerDraft } = useDraft();
  const router = useRouter();
  const [returnedDetail, setReturnedDetail] = useState<RD>();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const [title, setTitle] = useState<string>('');
  const [contents, setContents] = useState<string>('');
  const [currComponent, setCurrComponent] = useState<string>('basic');
  const [file, setFile] = useState<File[]>();
  const [existingFile, setExistingFile] = useState<string>('');
  const [fileState, setFileState] = useState<any>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [routePpl, setRoutePpl] = useState([]);
  const [process, setProcess] = useState<number | boolean | string>();
  const [taskId, setTaskId] = useState<number>(null);
  const [agentStatus, setAgentStatus] = useState<Agent[]>();

  useEffect(() => {
    const initialAction = async () => {
      const res = await fetchReturnedDetail(paramsId);
      setReturnedDetail(res);
    };
    initialAction();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsId]);

  useEffect(() => {
    if (returnedDetail !== undefined) {
      // 基本情報を格納
      setTitle(returnedDetail.title);
      setContents(returnedDetail.content);
      // ルートの情報を格納
      const routeTmp: {}[] = [];
      const routeMaxNum: number = 5;
      for (let i = 1; i <= routeMaxNum; i++) {
        if (returnedDetail[`route${i}_user`] !== null) {
          routeTmp.push(returnedDetail[`route${i}_user`]);
        }
      }
      setRoutePpl(routeTmp);
      // 中断された時点のルートを格納
      setProcess(returnedDetail.process.slice(-1));
      // 既存の添付ファイルのファイル名を格納
      setExistingFile(returnedDetail.filename);
      // taskIdを格納
      setTaskId(returnedDetail.id);
      // 代理設定を格納
      setAgentStatus(returnedDetail.agent_statuses);
    }
  }, [returnedDetail]);

  const discardOrSubmit = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const value = e.currentTarget.innerHTML;

    if (!confirm(`${value}しますか？`)) {
      return;
    }

    let action;
    if (e.currentTarget.innerHTML === '再提出') {
      action = 'reSubmit';
    } else if (e.currentTarget.innerHTML === '差戻し者へ提出') {
      action = 'toRetriever';
    } else {
      action = 'discard';
    }

    const draft: Draft = {
      title: title,
      content: contents,
      file: file,
      ppl: routePpl,
      action: action,
      id: paramsId,
    };

    if (action === 'reSubmit' || action === 'toRetriever') {
      await registerDraft(draft);
    } else {
      await discardReturnedTask(paramsId);
    }
    router.push('/returned');
  };

  return (
    <>
      {returnedDetail ? (
        <div>
          <LabelChoice
            currComponent={currComponent}
            setCurrComponent={setCurrComponent}
            isComment={true}
          />
          <DraftValidationError />
          {currComponent === 'basic' ? (
            <BasicInfo
              setTitle={setTitle}
              title={title}
              setContents={setContents}
              contents={contents}
            />
          ) : currComponent === 'additive' ? (
            <Additives
              setFile={setFile}
              fileRef={fileRef}
              setFileState={setFileState}
              existingFile={existingFile}
              taskId={taskId}
              setExistingFile={setExistingFile}
            />
          ) : currComponent === 'route' ? (
            <Routing
              setPplInRoute={setRoutePpl}
              pplInRoute={routePpl}
              process={process}
              isRegisteredRoute={false}
              agentStatus={agentStatus}
            />
          ) : (
            <Comment comment={returnedDetail.returned_task.comment} editable={false} />
          )}
          <div>
            <Button onClick={(e) => discardOrSubmit(e)} background={'light'}>
              再提出
            </Button>
            <Button onClick={(e) => discardOrSubmit(e)} marginTop={20} background={'medium'}>
              差戻し者へ提出
            </Button>
            <Button onClick={(e) => discardOrSubmit(e)} marginTop={20}>
              破棄
            </Button>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ReturnedTaskDetail;
