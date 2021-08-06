import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {useProgress} from '../../hooks/useProgress'
import BasicInfoInProgress from '../../components/progress/BasicInfoInProgress'
import AdditiveInProgress from '../../components/progress/AdditiveInProgress'
import RouteInProgress from '../../components/progress/RouteInProgress'
import SwitchTab from '../../components/layouts/SwitchTab'
import Button2 from '../../components/layouts/Button'
import Loading from '../../components/layouts/Loading';
import {useGlobal} from '../../hooks/useGlobal';
import styled from 'styled-components'


export const TaskDetail = (): React.ReactElement => {
    const router = useRouter();
    const [paramsId, setParamsId] = useState<number>(Number(router.query.id))
    const {fetchSelectedTask,actionInProgress, detailTask} = useProgress();
    const [title, setTitle] = useState<string>('')
    const [contents, setContents] = useState<string>('')
    const [currComponent, setCurrComponent] = useState<string>('basic')
    const {updateLoading, asyncLoading, HttpStatusCode} = useGlobal();

    useEffect(() => {
        if(paramsId) {
            const getTask = async () => {
                await fetchSelectedTask(paramsId)
                updateLoading()
            }
            getTask()
        }
    }, [paramsId]);

    useEffect(() => {
        // 初回の呼び出しではstate値を更新せず、detailTaskを非同期で取得したらstate値を更新する
        if(detailTask.length !== 0) {
            setContents(detailTask[0].content)
            setTitle(detailTask[0].title)
        }
    }, [detailTask])

    const discardOrRetrieve = (e: React.MouseEvent<HTMLSpanElement,MouseEvent>): void => {
        const value = e.currentTarget.innerHTML
        if(!confirm(`${value}しますか？`)) {
            return
        }
        if(value === '破棄') {
            actionInProgress('discard', paramsId)
        } else {
            actionInProgress('retrieve',paramsId)
        }
    }
    
    
    return (
        <>
            {asyncLoading === true ?
                // URL直打ちで別のパラメータを入力してきた場合の対策
                detailTask.length > 0 ?
                    <div>
                        <SwitchTab 
                            currComponent={currComponent}
                            setCurrComponent={setCurrComponent}
                            isComment={false}
                        />
                        {currComponent === 'basic' ? 
                            <BasicInfoInProgress 
                                title={title}
                                contents={contents}    
                            />:
                        currComponent === 'additive' ?
                            <AdditiveInProgress 
                                filename={detailTask[0].filename}
                                taskId={paramsId}
                            />:
                            <RouteInProgress
                                taskRoute={detailTask}
                                completed={false}
                            />
                        }<br/>
                        <div>
                            <Button onClick={(e) => discardOrRetrieve(e)}>破棄</Button>
                            <Button onClick={(e) => discardOrRetrieve(e)}>引戻し</Button>
                        </div>
                    </div>
                :''
            :
                <Loading/>
            }
        </>
    )
}

const Button = styled.button`
    margin-right: 20px;
`;


export default TaskDetail