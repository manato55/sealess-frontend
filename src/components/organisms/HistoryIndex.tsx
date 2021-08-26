import React, { useEffect, useRef, useState } from 'react';
import { useComplete } from '../../hooks/useComplete';
import TableContents from '../molecules/TableContents';
import Select from '../atoms/Select';
import styled from 'styled-components';

type Task = {
  id: number;
  title: string;
  process: string;
  updated_at: string;
};

interface Props {}

const HistoryIndex = (props: Props) => {
  const { fetchCompletedTask } = useComplete();
  const sortChoice = [
    { ja: '個人', en: 'individual' },
    { ja: '部', en: 'dep' },
    { ja: '課', en: 'sec' },
  ];
  const unitRef = useRef<HTMLSelectElement>(null);
  const [completedTask, setCompletedTask] = useState<Task[]>();

  useEffect(() => {
    const initialAction = async () => {
      // 初期表示は個人案件のみ取得するための引数を入力
      const res = await fetchCompletedTask(sortChoice[0].en);
      setCompletedTask(res);
    };
    initialAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function unitChoice(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
    const res = await fetchCompletedTask(e.target.value);
    setCompletedTask(res);
  }

  return (
    <>
      {completedTask && (
        <div>
          <SelectEdit onChange={(e) => unitChoice(e)} defaultValue={'choice'} ref={unitRef}>
            {sortChoice.map((choice, i) => (
              <option key={i} value={choice.en}>
                {choice.ja}
              </option>
            ))}
          </SelectEdit>
          {completedTask?.length !== 0 ? (
            <TableContents
              tasks={completedTask}
              th={['案件名', '決定権者', '完了日時']}
              pathName={'history'}
            />
          ) : (
            <div>{'案件はありません。'}</div>
          )}
        </div>
      )}
    </>
  );
};

const SelectEdit = styled(Select)`
  width: 30%;
`;

export default HistoryIndex;
