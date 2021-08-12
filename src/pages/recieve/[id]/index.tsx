import React, {useEffect, useState, useCallback} from 'react'
import BasicInfo from '../../../components/molecules/BasicInfo'
import {useProgress} from '../../../hooks/useProgress'
import {useRouter} from 'next/router'
import AdditiveInProgress from '../../../components/organisms/AdditiveInProgress'
import RouteInProgress from '../../../components/organisms/RouteInProgress'
import styled from 'styled-components'
import Link from 'next/link';
import { useSetRecoilState } from 'recoil'
import { http } from '../../../store/atom'
import { useSWRFunc } from '../../../hooks/useSWRFunc';
import LabelChoice from '../../../components/molecules/LabelChoice'
import Button from '../../../components/atoms/Button'


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
        if(!confirm('承認しますか？')) {
            return;
        }
        actionInEscalation('approve', paramsId)
    }

    return (
        <>
            {extracedTask &&
                <div>
                    <LabelChoice 
                        currComponent={currComponent}
                        setCurrComponent={setCurrComponent}
                        isComment={false}
                    />
                    {currComponent === 'basic' ? 
                        <BasicInfo
                            title={extracedTask.title}
                            contents={extracedTask.content}
                            editable={false}
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
                        <Button 
                            onClick={() => approveOrReturn()}
                            marginTop={20}
                        >
                            承認
                        </Button>
                        <Link href={`/recieve/${paramsId}/comment`} passHref>
                            <ToCommentPage>差戻し画面へ</ToCommentPage>
                        </Link>
                    </div>
                </div>
            }
        </>
    )
}


const ToCommentPage = styled.a`
    text-decoration: underline;
    color: blue;
    margin-top: 30px;
    display: inline-block;
`;

export default RecievedTask