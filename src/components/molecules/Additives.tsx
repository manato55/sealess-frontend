import React, {
  useState,
  RefObject,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import { useProgress } from '../../hooks/useProgress';
import { useReturnedTask } from '../../hooks/useReturnedTask';
import styled from 'styled-components';
import Input from '../atoms/Input';

interface Props {
  setFile: Dispatch<SetStateAction<File[]>>;
  setFileState: Dispatch<SetStateAction<any>>;
  setExistingFile: Dispatch<SetStateAction<string>>;
  fileRef: RefObject<HTMLInputElement>;
  existingFile: string;
  taskId: number;
}

export const Additives = (props: Props): React.ReactElement => {
  const [exstingFilename, setExistingFilename] = useState<string[]>([]);
  const { downloadFile } = useProgress();
  const { removeFile } = useReturnedTask();
  const [fileRemoval, setFileRemoval] = useState<boolean>(false);
  const [removingFile, setRemovingFile] = useState<string>(null);

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const files = [];
      let upFile = e.target.files;
      for (let i = 0; i < upFile.length; i++) {
        files.push(upFile[i]);
      }
      props.setFile(files);
    },
    [props]
  );

  useEffect(() => {
    if (props.existingFile !== '' && props.existingFile !== null) {
      let fileTmp = props.existingFile.split(',');
      setExistingFilename(fileTmp);
    } else {
      setExistingFilename(null);
    }
  }, [props.existingFile]);

  const download = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    const data: { filename: string; id: number } = {
      filename: e.currentTarget.innerHTML,
      id: props.taskId,
    };
    downloadFile(data);
  };

  async function remove(filename): Promise<void> {
    if (!confirm('削除しますか？')) {
      return;
    }
    setRemovingFile(filename);
    const data: { filename: string; id: number } = {
      filename: filename,
      id: props.taskId,
    };
    const res = await removeFile(data);
    setFileRemoval(res);
  }

  useEffect(() => {
    // DBでのファイル削除に成功したら表示を消す
    if (fileRemoval) {
      let index = exstingFilename.indexOf(removingFile);
      let newFilename = [...exstingFilename];
      newFilename.splice(index, 1);
      setExistingFilename(newFilename);

      // propsで受けたっとexistingFileの値を更新
      let filenameForProps: string = '';
      newFilename.map((file) => {
        filenameForProps += file + ',';
      });
      let slicedFilename: string = filenameForProps.slice(0, -1);
      props.setExistingFile(slicedFilename);
    }
    setFileRemoval(false);
  }, [fileRemoval]);

  return (
    <>
      <Input type="file" ref={props.fileRef} onChange={handleChangeFile} multiple />
      <div>
        {props.existingFile !== '' &&
          props.existingFile !== null &&
          exstingFilename.map((filename, index) => (
            <ul key={index}>
              <li>
                <span onClick={(e) => download(e)}>{filename}</span>
                <RemoveFileBtn onClick={() => remove(filename)}>✘</RemoveFileBtn>
              </li>
            </ul>
          ))}
      </div>
    </>
  );
};

const RemoveFileBtn = styled.span`
  cursor: pointer;
  margin-left: 30px;
`;

export default React.memo(Additives);
