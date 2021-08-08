import React, {useEffect, useRef, useState} from 'react'
import {useCompleted} from '../../hooks/useCompleted'
import TableContents from '../../components/molecules/TableContents';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <TableContents 
                        tasks={completedTask}
                        th={['案件名','決定権者','完了日時']}
                        pathName={'history'}
                    />
                :<div>{'案件はありません。'}</div>}
            </div>
        </>
    )
}

export default History