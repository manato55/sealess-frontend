import React, { useEffect, useState, useRef } from 'react'
import {useReturned} from '../../hooks/useReturned';
import {useGlobal} from '../../hooks/useGlobal';
import {useDraft} from '../../hooks/useDraft';
import Loading from '../../components/layouts/Loading';
import {useRouter} from 'next/router'
import BasicInfo from '../../components/molecules/BasicInfo'
import Additives from '../../components/molecules/Additives'
import Routing from '../../components/molecules/RouteSetting'
import Comment from '../../components/organisms/Comment'
import LabelChoice from '../../components/molecules/LabelChoice'
import Button from '../../components/atoms/Button'
import ErrorMessageWrapper from '../../components/atoms/ErrorMessageWrapper'



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

export const ReturnedDetail = (): React.ReactElement => {
    const {fetchReturnedDetail, returnedDetail, reSubmitReturnedTask, discardReturnedTask } = useReturned();
    const {validationMessage,clearValidationMessage} = useDraft();
    const router = useRouter();
    const [paramsId, setParamsId] = useState<number>(Number(router.query.id))
    const {updateLoading, asyncLoading} = useGlobal();
    const [title, setTitle] = useState<string>('');
    const [contents, setContents] = useState<string>('');
    const [currComponent, setCurrComponent] = useState<string>('basic')
    const [file, setFile] = useState<File[]>()
    const [fileNumber, setFileNumber] = useState<string[]>([])
    const [existingFile, setExistingFile] = useState<string>('')
    const [fileState, setFileState] = useState<any>();
    const fileRef = useRef<HTMLInputElement>(null);
    const [routePpl, setRoutePpl] = useState([])
    const [process, setProcess] = useState<number|boolean|string>()
    const [taskId, setTaskId] = useState<number>(null)
    const [agentStatus, setAgentStatus] = useState<agent[]>()


    useEffect(() => {
        return () => {
            clearValidationMessage()
        };
    }, []);

    useEffect(() => {
        if(paramsId !== undefined) {
            const initialAction = async() => {
                await fetchReturnedDetail(paramsId)
                updateLoading()
            }
            initialAction()
        }
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
            reSubmitReturnedTask(draft)
        } else {
            discardReturnedTask(paramsId)
        }
    }

    return (
        <> 
            {asyncLoading === true ?
                <div>
                    <LabelChoice 
                        currComponent={currComponent}
                        setCurrComponent={setCurrComponent}
                        isComment={true}
                    />
                    {Object.keys(validationMessage).length > 0 &&
                        <div>
                            {validationMessage.title &&
                                <ErrorMessageWrapper>{validationMessage.title}</ErrorMessageWrapper>
                            }
                            {validationMessage.content &&
                                <ErrorMessageWrapper>{validationMessage.content}</ErrorMessageWrapper>
                            }
                            {validationMessage.route &&
                                <ErrorMessageWrapper>{validationMessage.route}</ErrorMessageWrapper>
                            }
                            {fileNumber.length !== 0 && fileNumber.map((file,index) => 
                                <ErrorMessageWrapper key={index}>{validationMessage[file][0]}</ErrorMessageWrapper>
                            )}
                        </div>
                    }
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