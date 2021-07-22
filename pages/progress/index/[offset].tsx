import React,{useState, useEffect, useCallback} from 'react'
import {useProgress} from '../../../hooks/useProgress';
import {useGlobal} from '../../../hooks/useGlobal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toDateWeek } from '../../../lib/dateHelper';
import Loading from '../../../components/layouts/Loading';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Paginate from '../../../components/layouts/Paginate'
import TableContainer from '../../../components/layouts/TableContainer';
import Table from '../../../components/layouts/Table';
import { isAsynced } from '../../../store/atom'
import { useSetRecoilState,useRecoilValue } from 'recoil'



export const Progress = () => {
    const {fetchTaskInProgress, paginatedTaskInProgress, taskInProgress, getTotalLengthOfTaskInProgress} = useProgress();
    const {updateLoading, asyncLoading} = useGlobal();
    const router = useRouter();
    const taskPerPage: number = 3
    const offset = router.query.offset
        ? Number.parseInt(String(router.query.offset), 10)
        : 0;
    const asynced = useRecoilValue(isAsynced)
    const setIsAsynced = useSetRecoilState(isAsynced)


    const handleChangePage = useCallback(async(_: React.ChangeEvent<unknown>, page: number) => {
        await fetchTaskInProgress(page)
        router.push(`/progress/index/${page}`);  
    },[router]);


    useEffect(() => {
        const fetchIndex = async() => {
            await getTotalLengthOfTaskInProgress()
            await fetchTaskInProgress(offset)
            setIsAsynced(true)
        }
        fetchIndex()
        return () => {
            setIsAsynced(false)
        }
    }, []) 

    return (
        <>
            {asynced === true ?
                paginatedTaskInProgress.length !== 0 ?
                    <TableContainer>
                        <Table>
                            <thead>
                                <tr>
                                    <th>案件名</th>
                                    <th>保持者</th>
                                    <th>登録日時</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTaskInProgress.map((task,index) => 
                                    <tr key={index}>
                                        <td>
                                            <Link href="/progress/[id]" as={`/progress/${task.id}`}>
                                                <a>{task.title}</a>
                                            </Link>
                                        </td>
                                        <td>{task[`${task.process}_user`].name}</td>
                                        <td>{toDateWeek(task.created_at)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <Paginate
                            contents={taskInProgress}
                            perPage={taskPerPage}
                            offset={offset}
                            change={handleChangePage}
                        />
                    </TableContainer>
                :'案件はありません。'
            :<Loading/>
            }
        </>
    )
}


export default Progress