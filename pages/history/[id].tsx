import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {useCompleted} from '../../hooks/useCompleted'
import BasicInfoInProgress from '../../components/progress/BasicInfoInProgress'
import AdditiveInProgress from '../../components/progress/AdditiveInProgress'
import RouteInProgress from '../../components/progress/RouteInProgress'
import SwitchTab from '../../components/layouts/SwitchTab'
import Loading from '../../components/layouts/Loading';
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { userStatus } from '../../store/atom'

export const TaskDetail = (): React.ReactElement => {
    const router = useRouter();
    const [paramsId, setParamsId] = useState<number>(Number(router.query.id))
    const {fetchCompletetTaskDetail, detailTask} = useCompleted();
    const {discardTask} = useCompleted();
    const [title, setTitle] = useState<string>('')
    const [contents, setContents] = useState<string>('')
    const [currComponent, setCurrComponent] = useState<string>('basic')
    const user = useRecoilValue(userStatus)
    

    useEffect(() => {
        if(paramsId) {
            const getTask = async () => {
                await fetchCompletetTaskDetail(paramsId)
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

    const discard = (e: React.MouseEvent<HTMLSpanElement,MouseEvent>): void => {
        const value = e.currentTarget.innerHTML
        if(!confirm(`${value}しますか？`)) {
            return
        }
        discardTask(paramsId);    
    }
    
    return (
        <>
            {true ?
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
                                completed={true}
                            />
                        }<br/>
                        <div>
                            {detailTask[0].user_id === user.id && 
                                <Button onClick={(e) => discard(e)}>破棄</Button>
                            }
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