import React, {useEffect, useState, useCallback} from 'react'
import BasicInfoInProgress from '../../../components/progress/BasicInfoInProgress'
import {useProgress} from '../../../hooks/useProgress'
import {useRouter} from 'next/router'
import SwitchTab from '../../../components/layouts/SwitchTab'
import AdditiveInProgress from '../../../components/progress/AdditiveInProgress'
import RouteInProgress from '../../../components/progress/RouteInProgress'
import styled from 'styled-components'
import Link from 'next/link';
import { useSetRecoilState } from 'recoil'
import { http } from '../../../store/atom'
import { useSWRFunc } from '../../../hooks/useSWRFunc';


export const RecievedTask = (): React.ReactElement => {
    const router = useRouter();
    const [paramsId, setParamsId] = useState<number>(Number(router.query.id))
    const {actionInEscalation} = useProgress();
    const [extracedTask, setExtractedTask] = useState<any>()
    const [currComponent, setCurrComponent] = useState<string>('basic')
    const setHttpStatus = useSetRecoilState(http)
    const {recievedTask} = useSWRFunc();



    useEffect(() => {
        if(recievedTask?.length > 0) {
            // findは条件に合致するもの一つだけを返す
            const task = recievedTask.find(v => v.id === paramsId)
            if(!task) {
                setHttpStatus(404)
                return
            }
            setExtractedTask(task)
        }
    }, [recievedTask,paramsId])

    const approveOrReturn = (): void => {
        actionInEscalation('approve', paramsId)
    }

    return (
        <>
            {extracedTask !== undefined &&
                <div>
                    <SwitchTab 
                        currComponent={currComponent}
                        setCurrComponent={setCurrComponent}
                        isComment={false}
                    />
                    {currComponent === 'basic' ? 
                        <BasicInfoInProgress
                            title={extracedTask.title}
                            contents={extracedTask.content}
                        />:
                    currComponent === 'additive' ?
                        <AdditiveInProgress 
                            filename={extracedTask.filename}
                            taskId={paramsId}
                        />:
                        <RouteInProgress
                            taskRoute={[extracedTask]}
                            completed={false}
                        />
                    }
                    <br/>
                    <div>
                        <Button onClick={() => approveOrReturn()}>承認</Button>
                        <Link href="/recieve/[id]/comment" as={`/recieve/${paramsId}/comment`} passHref>
                            <ToCommentPage>差戻し画面へ</ToCommentPage>
                        </Link>
                    </div>
                </div>
            }
        </>
    )
}


const Button = styled.button`
    margin-right: 20px;
    cursor: pointer;
`;

const ToCommentPage = styled.a`
    text-decoration: underline;
    color: blue
`;

export default RecievedTask