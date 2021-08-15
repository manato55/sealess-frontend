import React, { Dispatch, SetStateAction, LegacyRef } from 'react';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import { useRecoilValue } from 'recoil';
import { authErrorMessage } from '../../store/atom';

interface Props {
  setTask: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  setSelectedJapYear: Dispatch<SetStateAction<number>>;
  fiscalYear: number[];
  taskRef: LegacyRef<HTMLInputElement>;
  nameRef: LegacyRef<HTMLInputElement>;
  yearRef: LegacyRef<HTMLSelectElement>;
}

export const SearchFunction = (props: Props): React.ReactElement => {
  const errorMessage = useRecoilValue(authErrorMessage);

  return (
    <>
      <ErrorMessageWrapper>{errorMessage.general && errorMessage.general}</ErrorMessageWrapper>
      <p>案件名</p>
      <input
        id="task"
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setTask(e.target.value)}
        ref={props.taskRef}
      />
      <p>担当者名</p>
      <input
        id="name"
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setName(e.target.value)}
        ref={props.nameRef}
      />
      <p>年度</p>
      <select
        id="year"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => props.setSelectedJapYear(Number(e.target.value))}
        defaultValue={'choice'}
        ref={props.yearRef}
      >
        <option value="choice" disabled>
          選択してください
        </option>
        {props.fiscalYear?.map((year, index) => (
          <option key={index} value={year}>
            令和{year}年度
          </option>
        ))}
      </select>
    </>
  );
};

export default SearchFunction;
