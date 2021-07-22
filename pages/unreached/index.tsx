import {useState, useEffect} from 'react'
import {useDraft} from '../../hooks/useDraft'
import {useGlobal} from '../../hooks/useGlobal'
import Link from 'next/link';
import Loading from '../../components/layouts/Loading';
import TableContainer from '../../components/layouts/TableContainer';
import Table from '../../components/layouts/Table';
import { toDateWeek } from '../../lib/dateHelper';
import { isAsynced } from '../../store/atom'
import { useSetRecoilState,useRecoilValue } from 'recoil'


export const UnreachedIndex = (): React.ReactElement => {
    const {updateLoading, asyncLoading} = useGlobal();
    const {fetchUnreachedTask, unreachedTask} = useDraft();
    const asynced = useRecoilValue(isAsynced)
    const setIsAsynced = useSetRecoilState(isAsynced)
    
    useEffect(() => {
        const initialAction = async() => {
            await fetchUnreachedTask()
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
                unreachedTask !== undefined && unreachedTask.length !== 0 ?
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