import React, { useEffect, useState, useRef } from 'react';
import { useReturnedTask, useReturnedTaskDetail } from '../../hooks/useReturnedTask';
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
import { authErrorMessage, http, eachErrorFlag } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

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

export const ReturnedTaskDetail = (): React.ReactElement => {
  const { discardReturnedTask } = useReturnedTask();
  const { registerDraft } = useDraft();
  const router = useRouter();
  const [paramsId, setParamsId] = useState<number>(Number(router.query.id));
  const { returnedTaskDetail } = useReturnedTaskDetail(paramsId);
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
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const setHttpStatus = useSetRecoilState(http);
  const setErrorMessage = useSetRecoilState(authErrorMessage);

  useEffect(() => {
    if (returnedTaskDetail) {
      // 基本情報を格納
      setTitle(returnedTaskDetail.title);
      setContents(returnedTaskDetail.content);
      // ルートの情報を格納
      const routeTmp = [];
      const routeMaxNum: number = 5;
      for (let i = 1; i <= routeMaxNum; i++) {
        if (returnedTaskDetail[`route${i}_user`] !== null) {
          routeTmp.push(returnedTaskDetail[`route${i}_user`]);
        }
      }
      setRoutePpl(routeTmp);
      // 中断された時点のルートを格納
      setProcess(returnedTaskDetail.process.slice(-1));
      // 既存の添付ファイルのファイル名を格納
      setExistingFile(returnedTaskDetail.filename);
      // taskIdを格納
      setTaskId(returnedTaskDetail.id);
      // 代理設定を格納
      setAgentStatus(returnedTaskDetail.agent_statuses);
    }
  }, [returnedTaskDetail]);

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
      const res = await registerDraft(draft);
      if (!res.isFailure) {
        toast.success('登録しました。');
        router.push('/returned');
      } else {
        if (res.error.code === 422) {
          setErrorMessage(res.error.message);
          const tmp = {
            file: false,
          };
          let keys = Object.keys(res.error.message);
          let fileExtracted = keys.filter((v) => v.match(/file/));
          tmp.file = fileExtracted.length > 0 ? true : false;
          setErrorFlag({
            ...errorFlag,
            file: tmp.file,
            title: res.error.message.title,
            content: res.error.message.content,
            route: res.error.message.route,
          });
        } else {
          setHttpStatus(res.error.code);
        }
      }
    } else {
      const res = await discardReturnedTask(paramsId);
      if (!res.isFailure) {
        router.push('/returned');
      } else {
        setHttpStatus(res.error.code);
      }
    }
  };

  return (
    <>
      {returnedTaskDetail ? (
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
            <Comment comment={returnedTaskDetail?.returned_task.comment} editable={false} />
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
