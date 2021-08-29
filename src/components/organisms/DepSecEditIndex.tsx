import styled from 'styled-components';
import React from 'react';
import { useDepSecIndex } from '../../hooks/useUser';
import Table from '../atoms/Table';
import Link from 'next/link';

interface Props {}

const DepSecEditIndex = (props: Props) => {
  const { depSecIndex } = useDepSecIndex();

  return (
    <>
      <Container>
        <Table>
          <thead>
            <tr>
              <th>部</th>
              <th>課</th>
            </tr>
          </thead>
          <tbody>
            {depSecIndex?.map((v, index1) => (
              <tr key={index1}>
                <td>
                  <Link href={`/admin/dep-index/department/${v.id}`}>
                    <a>{v.name}</a>
                  </Link>
                </td>
                {v.sections.length > 0 ? (
                  v.sections.map((sec, index2) => (
                    <Td key={index2}>
                      <Link href={`/admin/dep-index/section/${sec.id}`}>
                        <a>{sec.name}</a>
                      </Link>
                    </Td>
                  ))
                ) : (
                  <td></td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

const Container = styled.div`
  text-align: center;
`;

const Td = styled.td`
  display: block;
  height: inherit;
  line-height: 2.5;
`;

export default DepSecEditIndex;
