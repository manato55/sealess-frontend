import React, { useState, useEffect, useRef } from 'react';
import BasicInfo from '../molecules/BasicInfo';
import Additives from '../molecules/Additives';
import RouteSetting from '../molecules/RouteSetting';
import { useDraft } from '../../hooks/useDraft';
import Button from '../atoms/Button';
import LabelChoice from '../molecules/LabelChoice';
import DraftValidationError from '../molecules/DraftValidataionError';
import { toast } from 'react-toastify';
import { authErrorMessage, http, eachErrorFlag } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';

type Draft = {
  title: string;
  content: string;
  file: File[];
  ppl: object[];
  action: string;
};

export const CreateNewDraft = (): React.ReactElement => {
  const { registerDraft } = useDraft();
  const [title, setTitle] = useState<string>('');
  const [contents, setContents] = useState<string>('');
  const [currComponent, setCurrComponent] = useState<string>('basic');
  const [file, setFile] = useState<File[]>();
  const [pplInRoute, setPplInRoute] = useState([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileState, setFileState] = useState<any>();
  const [fileNumber, setFileNumber] = useState<string[]>([]);
  const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag);
  const setHttpStatus = useSetRecoilState(http);
  const setErrorMessage = useSetRecoilState(authErrorMessage);

  useEffect(() => {
    setFileState(fileRef);
  }, []);

  const submitDraft = async () => {
    if (!confirm('提出しますか？')) {
      return;
    }
    setFileNumber([]);
    const draft: Draft = {
      title: title,
      content: contents,
      file: file,
      ppl: pplInRoute,
      action: '',
    };
    const res = await registerDraft(draft);
    if (!res.isFailure) {
      toast.success('登録しました。');
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
        setHttpStatus(res.status);
      }
    }
  };

  return (
    <>
      <LabelChoice
        currComponent={currComponent}
        setCurrComponent={setCurrComponent}
        isComment={false}
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
          existingFile={''}
          taskId={null}
          setExistingFile={null}
        />
      ) : (
        <RouteSetting
          setPplInRoute={setPplInRoute}
          pplInRoute={pplInRoute}
          process={false}
          isRegisteredRoute={true}
          agentStatus={undefined}
        />
      )}
      <Button marginTop={20} background={'light'} onClick={() => submitDraft()}>
        提出
      </Button>
    </>
  );
};

export default CreateNewDraft;
