import React, { useCallback } from 'react';
import { useNormalUser } from '../../hooks/useUser';
import UsersIndex from '../molecules/UsersIndex';
import Select from '../atoms/Select';
import styled from 'styled-components';
import { departmentSelection } from '../../store/atom';
import { useSetRecoilState } from 'recoil';
import { useDepartment } from '../../hooks/useSWRFunc';

interface Props {}

export const AllUserIndex = (props: Props) => {
  const { normalUser } = useNormalUser();
  const setDepartment = useSetRecoilState(departmentSelection);
  const { fetchedDepartment } = useDepartment();

  return (
    <>
      <SelectDep
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartment(e.target.value)}
        defaultValue={'choice'}
      >
        <option value="choice" disabled>
          選択してください
        </option>
        {fetchedDepartment?.map((v, index) => (
          <option key={index} value={v.id}>
            {v.name}
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
