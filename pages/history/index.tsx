import React, {useEffect, useRef, useState} from 'react'
import {useCompleted} from '../../hooks/useCompleted'
import Loading from '../../components/layouts/Loading'
import {useGlobal} from '../../hooks/useGlobal';
import Link from 'next/link';
import { toDateWeek } from '../../lib/dateHelper';
import TableContainer from '../../components/layouts/TableContainer';
import Table from '../../components/layouts/Table';
import { isAsynced } from '../../store/atom'
import { useSetRecoilState,useRecoilValue } from 'recoil'


export const History = (): React.ReactElement => {
    const {fetchCompletedTask, completedTask} = useCompleted();
    const {updateLoading, asyncLoading} = useGlobal();
    const sortChoice: {ja: string;en: string}[] = [
        {ja: "個人", en: "individual"},
        {ja: "部", en: "dep"},
        {ja: "課", en: "sec"},
    ]
    const unitRef = useRef<HTMLSelectElement>(null)
    const asynced = useRecoilValue(isAsynced)
    const setIsAsynced = useSetRecoilState(isAsynced)


    useEffect(() => {
        const initialAction = async() => {
            // 初期表示は個人案件のみ取得するための引数を入力
            await fetchCompletedTask(sortChoice[0].en)
            setIsAsynced(true)
        }
        initialAction()
        return () => {
            setIsAsynced(false)
        }
    }, [])

    async function unitChoice(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
        await fetchCompletedTask(e.target.value)
    }

    return (
        <>
            {asynced === true ?
                <div>
                    <select onChange={(e) => unitChoice(e)} defaultValue={'choice'} ref={unitRef}>
                        {sortChoice.map((choice, i) => 
                            <option key={i} value={choice.en}>{choice.ja}</option>
                            )}
                    </select>
                    {completedTask?.length !== 0 ?
                        <TableContainer>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>案件名</th>
                                        <th>決定権者</th>
                                        <th>完了日時</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {completedTask?.map((task,index) => 
                                        <tr key={index}>
                                            <td>
                                                <Link href="/history/[id]" as={`/history/${task.id}`}>
                                                    <a>{task.title}</a>
                                                </Link>
                                            </td>
                                            <td>{task[`${task.process}_user`].name}</td>
                                            <td>{toDateWeek(task.updated_at)}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </TableContainer>
                    :<div>{'案件はありません。'}</div>}
                </div>
            :<Loading/>}
        </>
    )
}

export default History