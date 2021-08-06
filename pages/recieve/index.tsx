import React,{useEffect,} from 'react'
import {useProgress} from '../../hooks/useProgress'
import TableContainer from '../../components/layouts/TableContainer';
import Table from '../../components/layouts/Table';
import Link from 'next/link';
import { toDateWeek } from '../../lib/dateHelper';
import { useSWRFunc } from '../../hooks/useSWRFunc';


export const Receive = (): React.ReactElement => {
    const {isLoading,recievedTask} = useSWRFunc();

    return (
        <>
            {isLoading ? (<p>Loading...</p>
                ) : (
                recievedTask?.length > 0 ?
                    <TableContainer>
                        <Table>
                            <thead>
                                <tr>
                                    <th>案件名</th>
                                    <th>起案者</th>
                                    <th>受信日時</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recievedTask?.map((task,index) => 
                                    <tr key={index}>
                                        <td>
                                            <Link href="/recieve/[id]" as={`/recieve/${task.id}`}>
                                                <a>{task.title}</a>
                                            </Link>
                                        </td>
                                        <td>{task.user.section}&emsp;{task.user.name}</td>
                                        <td>{toDateWeek(task.updated_at)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </TableContainer>
                :'案件はありません。'
            )}
        </>
    )
}

export default Receive