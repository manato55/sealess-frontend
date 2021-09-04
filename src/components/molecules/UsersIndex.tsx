import React from 'react';
import styled from 'styled-components';
import Table from '../atoms/Table';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AdminUser } from '../../hooks/useCompany';

interface Props {
  users: AdminUser[];
  th: string[];
  displayContents: string[];
  isEmail?: boolean;
}

export const UsersManagementIndex = (props: Props) => {
  const router = useRouter();

  return (
    <>
      <TableCenter>
        <thead>
          <tr>
            {props.th.map((thName, index) => (
              <th key={index}>{thName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.users?.map((user, index) => (
            <tr key={index}>
              <td>
                <Link href={`${router.pathname}/${user.id}`}>
                  <a>{user[props.displayContents[0]]}</a>
                </Link>
              </td>
              <td>{user[props.displayContents[1]].name}</td>
              {props.isEmail ? (
                <td>{user[props.displayContents[2]]}</td>
              ) : (
                <td>{user[props.displayContents[2]].name}</td>
              )}
            </tr>
          ))}
        </tbody>
      </TableCenter>
    </>
  );
};

const TableCenter = styled(Table)`
  text-align: center;
`;

export default UsersManagementIndex;
