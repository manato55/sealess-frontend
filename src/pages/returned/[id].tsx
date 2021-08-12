import React, { useEffect, useState, useRef } from 'react'
import {useReturnedTask} from '../../hooks/useReturnedTask';
import {useDraft} from '../../hooks/useDraft';
import Loading from '../../components/atoms/Loading';
import {useRouter} from 'next/router'
import BasicInfo from '../../components/molecules/BasicInfo'
import Additives from '../../components/molecules/Additives'
import Routing from '../../components/molecules/RouteSetting'
import Comment from '../../components/organisms/Comment'
import LabelChoice from '../../components/molecules/LabelChoice'
import Button from '../../components/atoms/Button'
import DraftValidationError from '../../components/molecules/DraftValidataionError'


type draft = {
    title: string;
    content: string;
    file: File[],
    ppl: object[]
    action: string;
    id: number;
}

type agent = {
    route: string;
    user: {
        name: string;
        id: number;
        department: string;
        section: string;
    }
    agent_user: number;
}


type RD = {
    title: string;
    content: string;
    returned_task?: {
        comment: string
    };
    process: string;
    filename: string;
    id: number;
    agent_statuses: {
        route: string;
        user: {
            name: string;
            id: number;
            department: string;
            section: string;
        }
        agent_user: number;
    }[];
}


export const ReturnedDetail = (): React.ReactElement => {
    const {fetchReturnedDetail, discardReturnedTask } = useReturnedTask();
    const {registerDraft} = useDraft();
    const router = useRouter();
    const [returnedDetail, setReturnedDetail] = useState<RD>();
    const [paramsId, setParamsId] = useState<number>(Number(router.query.id))
    const [title, setTitle] = useState<string>('');
    const [contents, setContents] = useState<string>('');
    const [currComponent, setCurrComponent] = useState<string>('basic')
    const [file, setFile] = useState<File[]>()
    const [existingFile, setExistingFile] = useState<string>('')
    const [fileState, setFileState] = useState<any>();
    const fileRef = useRef<HTMLInputElement>(null);
    const [routePpl, setRoutePpl] = useState([])
    const [process, setProcess] = useState<number|boolean|string>()
    const [taskId, setTaskId] = useState<number>(null)
    const [agentStatus, setAgentStatus] = useState<agent[]>()


    useEffect(() => {
        const initialAction = async() => {
            const res = await fetchReturnedDetail(paramsId)
            setReturnedDetail(res)
        }
        initialAction()
    },[paramsId])

    useEffect(() => {
        if(returnedDetail !== undefined) {
            // 基本情報を格納
            setTitle(returnedDetail.title)
            setContents(returnedDetail.content)
            // ルートの情報を格納
            const routeTmp: {}[] = []
            const routeMaxNum: number = 5
            for(let i=1;i<=routeMaxNum;i++) {
                if(returnedDetail[`route${i}_user`] !== null) {
                    routeTmp.push(returnedDetail[`route${i}_user`])
                }
            }
            setRoutePpl(routeTmp)
            // 中断された時点のルートを格納
            setProcess(returnedDetail.process.slice(-1))
            // 既存の添付ファイルのファイル名を格納
            setExistingFile(returnedDetail.filename)
            // taskIdを格納
            setTaskId(returnedDetail.id)
            // 代理設定を格納
            setAgentStatus(returnedDetail.agent_statuses)
        }
    }, [returnedDetail])

    const discardOrSubmit = (e: React.MouseEvent<HTMLSpanElement,MouseEvent>): void => {
        const value = e.currentTarget.innerHTML

        if(!confirm(`${value}しますか？`)) {
            return
        }

        const draft: draft = {
            title: title,
            content: contents,
            file: file,
            ppl: routePpl,
            action: 'reSubmit',
            id: paramsId,
        }

        if(value === '再提出') {
            registerDraft(draft)
        } else {
            discardReturnedTask(paramsId)
        }
    }


    return (
        <> 
            {returnedDetail ?
                <div>
                    <LabelChoice 
                        currComponent={currComponent}
                        setCurrComponent={setCurrComponent}
                        isComment={true}
                    />
                    <DraftValidationError />
                    {currComponent === 'basic' ? 
                        <BasicInfo 
                            setTitle={setTitle}
                            title={title}
                            setContents={setContents}
                            contents={contents}
                        />:
                    currComponent === 'additive' ?
                        <Additives 
                            setFile={setFile}
                            fileRef={fileRef}
                            setFileState={setFileState}
                            existingFile={existingFile}
                            taskId={taskId}
                            setExistingFile={setExistingFile}
                        />:
                    currComponent === 'route' ?
                        <Routing
                            setPplInRoute={setRoutePpl}
                            pplInRoute={routePpl}
                            process={process}
                            isRegisteredRoute={false}
                            agentStatus={agentStatus}
                        />:
                        <Comment
                            comment={returnedDetail.returned_task.comment}
                            editable={false}
                        />
                    }
                    <br/> 
                    <div>
                        <Button
                            onClick={(e) => discardOrSubmit(e)}
                            background={'light'}
                        >
                            再提出
                        </Button>
                        <Button 
                            onClick={(e) => discardOrSubmit(e)}
                            marginTop={20}
                        >
                            破棄
                        </Button>
                    </div>
                </div>
            :
                <Loading/>
            }
        </>
    )
}


export default ReturnedDetail