import React, { useCallback } from 'react';
import { useNormalUser } from '../../hooks/useUser';
import UsersIndex from '../molecules/UsersIndex';
import Select from '../atoms/Select';
import styled from 'styled-components';
import { DEPARTMENT } from '../../const/JobInfo';
import { departmentSelection } from '../../store/atom';
import { useSetRecoilState } from 'recoil';

interface Props {}

export const AllUserIndex = (props: Props) => {
  const { normalUser } = useNormalUser();
  const setDepartment = useSetRecoilState(departmentSelection);

  const depChoice = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      setDepartment(e.target.value);
    },
    [setDepartment]
  );

  return (
    <>
      <SelectDep onChange={(e) => depChoice(e)} defaultValue={'choice'}>
        <option value="choice" disabled>
          選択してください
        </option>
        {DEPARTMENT.map((v, index) => (
          <option key={index} value={v}>
            {v}
          </option>
        ))}
      </SelectDep>
      <UsersIndex
        users={normalUser}
        th={['名前', '部', '課']}
        displayContents={['name', 'department', 'section']}
      />
    </>
  );
};

const SelectDep = styled(Select)`
  margin: 20px;
  width: 30%;
`;

export default AllUserIndex;
