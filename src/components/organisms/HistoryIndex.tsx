import React, { useEffect, useRef, useState } from 'react';
import { useCompletedTask } from '../../hooks/useComplete';
import TableContents from '../molecules/TableContents';
import Select from '../atoms/Select';
import styled from 'styled-components';
import Loading from '../atoms/Loading';

type Task = {
  id: number;
  title: string;
  process: string;
  updated_at: string;
};

interface Props {}

const HistoryIndex = (props: Props) => {
  const [choice, setChoice] = useState<string>('individual');
  const sortChoice = [
    { ja: '個人', en: 'individual' },
    { ja: '部', en: 'dep' },
    { ja: '課', en: 'sec' },
  ];
  const { completedTask } = useCompletedTask(choice);
  const unitRef = useRef<HTMLSelectElement>(null);

  return (
    <>
      <SelectEdit
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChoice(e.target.value)}
        defaultValue={'choice'}
        ref={unitRef}
      >
        {sortChoice.map((choice, i) => (
          <option key={i} value={choice.en}>
            {choice.ja}
          </option>
        ))}
      </SelectEdit>
      {!completedTask ? (
        <Loading />
      ) : completedTask?.length > 0 ? (
        <TableContents
          tasks={completedTask}
          th={['案件名', '決定権者', '完了日時']}
          pathName={'history'}
        />
      ) : (
        <div>{'案件はありません。'}</div>
      )}
    </>
  );
};

const SelectEdit = styled(Select)`
  width: 30%;
`;

export default HistoryIndex;
