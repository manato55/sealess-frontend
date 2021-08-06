import React, {useEffect, useRef, useState} from 'react'
import {useCompleted} from '../../hooks/useCompleted'
import Link from 'next/link';
import { toDateWeek } from '../../lib/dateHelper';
import TableContainer from '../../components/layouts/TableContainer';
import Table from '../../components/layouts/Table';


export const History = (): React.ReactElement => {
    const {fetchCompletedTask, completedTask} = useCompleted();
    const sortChoice = [
        {ja: "個人", en: "individual"},
        {ja: "部", en: "dep"},
        {ja: "課", en: "sec"},
    ]
    const unitRef = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        const initialAction = async() => {
            // 初期表示は個人案件のみ取得するための引数を入力
            await fetchCompletedTask(sortChoice[0].en)
        }
        initialAction()
        return () => {
        }
    }, [])

    async function unitChoice(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
        await fetchCompletedTask(e.target.value)
    }

    return (
        <>
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
        </>
    )
}

export default History