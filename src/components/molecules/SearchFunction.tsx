import React, { useRef, useEffect } from 'react';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Input from '../atoms/Input';
import { useRecoilValue } from 'recoil';
import { authErrorMessage } from '../../store/atom';
import Select from '../atoms/Select';
import { useRecoilState } from 'recoil';
import { searchKeyword } from '../../store/atom';
import styled from 'styled-components';

interface Props {
  fiscalYear: number[];
}

export const SearchFunction = (props: Props): React.ReactElement => {
  const errorMessage = useRecoilValue(authErrorMessage);
  const [keyword, setKeyword] = useRecoilState(searchKeyword);
  const taskRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    taskRef.current.value = keyword.task;
    nameRef.current.value = keyword.name;
    yearRef.current.value = keyword.year === null ? 'choice' : keyword.year;
  }, [keyword]);

  return (
    <>
      <ErrorMessageWrapper>{errorMessage.general && errorMessage.general}</ErrorMessageWrapper>
      <p>案件名</p>
      <Input
        id="task"
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKeyword({ ...keyword, task: e.target.value })
        }
        ref={taskRef}
      />
      <p>担当者名</p>
      <Input
        id="name"
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKeyword({ ...keyword, name: e.target.value })
        }
        ref={nameRef}
      />
      <p>年度</p>
      <SelectYear
        id="year"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setKeyword({ ...keyword, year: Number(e.target.value) })
        }
        defaultValue={'choice'}
        ref={yearRef}
      >
        <option value="choice" disabled>
          選択してください
        </option>
        {props.fiscalYear?.map((year, index) => (
          <option key={index} value={year}>
            令和{year}年度
          </option>
        ))}
      </SelectYear>
    </>
  );
};

const SelectYear = styled(Select)`
  height: 40px;
  width: 40%;
`;

export default SearchFunction;
