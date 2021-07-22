import React, {useEffect, useState, useCallback} from 'react'
import BasicInfoInProgress from '../../../components/progress/BasicInfoInProgress'
import {useProgress} from '../../../hooks/useProgress'
import {useRouter} from 'next/router'
import Loading from '../../../components/layouts/Loading';
import {useGlobal} from '../../../hooks/useGlobal';
import SwitchTab from '../../../components/layouts/SwitchTab'
import AdditiveInProgress from '../../../components/progress/AdditiveInProgress'
import RouteInProgress from '../../../components/progress/RouteInProgress'
import styled from 'styled-components'
import Link from 'next/link';


export const RecievedTask = (): React.ReactElement => {
    const [paramsId, setParamsId] = useState<number>()
    const {recievedTask, fetchRecievedTask, actionInEscalation} = useProgress();
    const router = useRouter();
    const {updateLoading, asyncLoading} = useGlobal();
    const [extracedTask, setExtractedTask] = useState<any>()
    const [currComponent, setCurrComponent] = useState<string>('basic')


    useEffect(() => {
        if (router.asPath !== router.route) {
            setParamsId(Number(router.query.id));
        }
        
    }, [router]);

    useEffect(() => {
        const initialAction = async() => {
            await fetchRecievedTask()
            updateLoading()
        }
        initialAction()
    },[])
    

    useEffect(() => {
        if(recievedTask.length > 0) {
            // findは条件に合致するもの一つだけを返す
            const task = recievedTask.find(v => v.id === paramsId)
            setExtractedTask(task)
        }
    }, [recievedTask,paramsId])

    const approveOrReturn = (): void => {
        actionInEscalation('approve', paramsId)
    }

    return (
        <>
            {asyncLoading === true ?
                <div>
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
                                <Link href="/recieve/[id]/comment" as={`/recieve/${paramsId}/comment`}>
                                    <a><ToCommentPage>差戻し画面へ</ToCommentPage></a>
                                </Link>
                            </div>
                        </div>
                    }
                </div>
            :
                <Loading/>
            }
        </>
    )
}


const Button = styled.button`
    margin-right: 20px;
    cursor: pointer;
`;

const ToCommentPage = styled.span`
    text-decoration: underline;
    color: blue
`;

export default RecievedTask