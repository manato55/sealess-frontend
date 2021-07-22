import React, { useEffect } from 'react'
import {useReturned} from '../../hooks/useReturned';
import {useGlobal} from '../../hooks/useGlobal';
import Loading from '../../components/layouts/Loading';
import Link from 'next/link';
import { toDateWeek } from '../../lib/dateHelper';
import TableContainer from '../../components/layouts/TableContainer';
import Table from '../../components/layouts/Table';
import { isAsynced } from '../../store/atom'
import { useSetRecoilState,useRecoilValue } from 'recoil'


export const Returned = (): React.ReactElement => {
    const {fetchReturnedTask, returnedTask} = useReturned()
    const {updateLoading, asyncLoading, initializeLoading} = useGlobal();
    const asynced = useRecoilValue(isAsynced)
    const setIsAsynced = useSetRecoilState(isAsynced)


    useEffect(() => {
        const initialAction = async() => {
            await fetchReturnedTask()
            setIsAsynced(true)
        }
        initialAction()
        return () => {
            setIsAsynced(false)
        }
    }, [])


    return (
        <>
            {asynced === true ?
                returnedTask?.length !== 0 ?
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
                : '案件はありません。'
            : <Loading/>
            }
        </>
    )
}


export default Returned