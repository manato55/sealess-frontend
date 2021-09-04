import React, { useEffect, useState } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { saveAs } from 'file-saver';
import { useSetRecoilState } from 'recoil';
import { http } from '../../store/atom';
import styled from 'styled-components';

type TopProps = {
  filename: string;
  taskId: number;
};

export const AdditiveInProgress = (props: TopProps): React.ReactElement => {
  const [files, setFiles] = useState<string[]>([]);
  const { downloadFile } = useProgress();
  const setHttpStatus = useSetRecoilState(http);

  useEffect(() => {
    const fetchFiles = async () => {
      if (props.filename !== null) {
        const fileTmp = props.filename.split(',');
        setFiles(fileTmp);
      } else {
        setFiles(null);
      }
    };
    fetchFiles();
  }, [props.filename]);

  const download = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const data: { filename: string; id: number } = {
      filename: e.currentTarget.innerHTML,
      id: props.taskId,
    };
    const res = await downloadFile(data);
    if (!res.Failure) {
      const blob = new Blob([res.value.data], {
        type: res.value.data.type,
      });
      const contentDisposition = res.value.headers['content-disposition'];
      const fileName = contentDisposition.substring(contentDisposition.indexOf('=') + 1);
      saveAs(blob, fileName);
    } else {
      setHttpStatus(res.error.code);
    }
  };

  return (
    <>
      {files !== null &&
        files.length !== 0 &&
        files.map((file, index) => (
          <ul key={index}>
            <FileTag onClick={(e) => download(e)}>{file}</FileTag>
          </ul>
        ))}
    </>
  );
};

const FileTag = styled.li`
  cursor: pointer;
`;

export default AdditiveInProgress;
