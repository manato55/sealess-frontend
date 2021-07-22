import React,{useEffect,} from 'react'
import {useProgress} from '../../hooks/useProgress'
import Loading from '../../components/layouts/Loading';
import TableContainer from '../../components/layouts/TableContainer';
import Table from '../../components/layouts/Table';
import {useGlobal} from '../../hooks/useGlobal';
import Link from 'next/link';
import { toDateWeek } from '../../lib/dateHelper';
import { isAsynced } from '../../store/atom'
import { useSetRecoilState,useRecoilValue } from 'recoil'


export const Receive = (): React.ReactElement => {
    const {fetchRecievedTask, recievedTask} = useProgress();
    const {updateLoading, asyncLoading, initializeLoading} = useGlobal();
    const asynced = useRecoilValue(isAsynced)
    const setIsAsynced = useSetRecoilState(isAsynced)

    
    useEffect(() => {
        const initialAction = async() => {
            await fetchRecievedTask()
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
                recievedTask.length !== 0 ?
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
                                {recievedTask.map((task,index) => 
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
            :
                <Loading/>
            }
        </>
    )
}

export default Receive