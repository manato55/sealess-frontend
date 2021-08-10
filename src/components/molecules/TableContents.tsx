import React from 'react'
import Tr from '../atoms/Tr'
import {Task} from '../../hooks/useReturnedTask';
import Table from '../atoms/Table'
import styled from 'styled-components'


interface Props {
    tasks: Task[];
    th: string[];
    pathName: string;
}

export const TableContents = (props: Props): React.ReactElement => {
    return (
        <>
            <Container>
                <Table>
                    <thead>
                        <tr>
                            {props.th.map((thName, index) =>
                                <th key={index}>{thName}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {props.tasks?.map((task,index) => 
                            <Tr
                                key={index}
                                task={task}
                                pathName={props.pathName}
                            />
                        )}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}


const Container = styled.div`
    text-align: center;

    table {
        display: block;
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
        text-align: center;
        table-layout: fixed;
        width: 100%;
        margin-top: 40px;
    }

    table tr, table td {
        white-space: nowrap;
        width: 10%;
    }
`;



export default TableContents