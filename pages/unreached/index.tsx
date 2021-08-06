import {useUnreachedTask} from '../../hooks/useSWRFunc'
import Link from 'next/link';
import Loading from '../../components/layouts/Loading';
import TableContainer from '../../components/layouts/TableContainer';
import Table from '../../components/layouts/Table';
import { toDateWeek } from '../../lib/dateHelper';


export const UnreachedIndex = (): React.ReactElement => {
    const {isLoading, unreachedTask} = useUnreachedTask();
    

    return (
        <>
            {!isLoading ?
                unreachedTask?.length > 0 ?
                    <TableContainer>
                        <Table>
                            <thead>
                                <tr>
                                    <th>案件名</th>
                                    <th>担当者</th>
                                    <th>作成日</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unreachedTask.map((task,index) => 
                                    <tr key={index}>
                                        <td>
                                            <Link href="/unreached/[id]" as={`/unreached/${task.id}`}>
                                                <a>{task.title}</a>
                                            </Link>
                                        </td>
                                        <td>{task.user.name}</td>
                                        <td>{toDateWeek(task.created_at)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </TableContainer>
                : '案件はありません。'
            : <Loading/>
            }
        </>
    )
}


export default UnreachedIndex