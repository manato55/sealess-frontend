import React, { useEffect } from 'react'
import {useReturnedTask} from '../../hooks/useReturnedTask';
import Link from 'next/link';
import { toDateWeek } from '../../lib/dateHelper';
import TableContainer from '../../components/layouts/TableContainer';
import Table from '../../components/layouts/Table';


export const Returned = (): React.ReactElement => {
    const {isLoading,returnedTask} = useReturnedTask()

    return (
        <>
        {isLoading ? <p>Loding...</p>
        :
        <div>
            {returnedTask?.length > 0 ?
                <TableContainer>
                    <Table>
                        <thead>
                            <tr>
                                <th>案件名</th>
                                <th>返却者</th>
                                <th>返却日時</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnedTask?.map((task,index) => 
                                <tr key={index}>
                                    <td>
                                        <Link href="/returned/[id]" as={`/returned/${task.id}`}>
                                            <a>{task.title}</a>
                                        </Link>
                                    </td>
                                    <td>{task.returned_task.user_id === task.user_id ? 
                                            <span>本人</span>:
                                            <span>{task.returned_task.user.section}&emsp;{task.returned_task.user.name}</span>
                                        }
                                    </td>
                                    <td>{toDateWeek(task.updated_at)}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </TableContainer>
            : '案件はありません。'}
        </div>
        }
        </>
    )
}


export default Returned