import React, { useCallback, useState } from 'react';
import { useUpdateCompanyInfo, useDepartment } from '../../hooks/useCompany';
import UsersIndex from '../molecules/UsersIndex';
import Select from '../atoms/Select';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { departmentSelection } from '../../store/atom';

interface Props {}

export const AllUserIndex = (props: Props) => {
  const [departmentId, setDepartmentId] = useRecoilState(departmentSelection);
  const { normalUser } = useUpdateCompanyInfo(departmentId);
  const { fetchedDepartment } = useDepartment();

  return (
    <>
      <SelectDep
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setDepartmentId(Number(e.target.value))
        }
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
