import React,{useState, useEffect, useRef} from 'react'
import BasicInfo from '../components/molecules/BasicInfo'
import Additives from '../components/molecules/Additives'
import RouteSetting from '../components/molecules/RouteSetting'
import {useDraft} from '../hooks/useDraft'
import { toast } from 'react-toastify'
import Button from '../components/atoms/Button'
import LabelChoice from '../components/molecules/LabelChoice'
import ErrorMessageWrapper from '../components/atoms/ErrorMessageWrapper'

type draft = {
    title: string;
    content: string;
    file: File[],
    ppl: object[]
    action: string,
}


export const Top = (): React.ReactElement => {
    const {registerDraft,validationMessage,clearValidationMessage} = useDraft();
    const [title, setTitle] = useState<string>('');
    const [contents, setContents] = useState<string>('');
    const [currComponent, setCurrComponent] = useState<string>('basic')
    const [file, setFile] = useState<File[]>()
    const [pplInRoute, setPplInRoute] = useState([])
    const fileRef = useRef<HTMLInputElement>(null);
    const [fileState, setFileState] = useState<any>();
    const [fileNumber, setFileNumber] = useState<string[]>([])
    const [registerFlag, setRegisterFlag] = useState<boolean>(false)


    useEffect(() => {
        setFileState(fileRef)
    }, [])

    useEffect(() => {
        return () => {
            clearValidationMessage()
        };
    }, []);

    async function submitDraft(): Promise<void> {
        if(!confirm('提出しますか？')) {
            return;
        }
        setFileNumber([])
        const draft: draft = {
            title: title,
            content: contents,
            file: file,
            ppl: pplInRoute,
            action: '',
        }
        await registerDraft(draft);
        setRegisterFlag(true)
    }

    useEffect(() => {
        if(registerFlag === true && Object.keys(validationMessage).length === 0) {
            toast.success('登録しました。')
        }
        setRegisterFlag(false)
    }, [registerFlag, validationMessage])

    useEffect(() => {
        if(Object.keys(validationMessage).length > 0) {
            let keys: string[] = Object.keys(validationMessage)
            let fileExtracted: string[] = keys.filter(v => v.match(/file/))
            setFileNumber(fileExtracted)
        }
    }, [validationMessage])
    
    return (
        <>  
            <LabelChoice 
                currComponent={currComponent}
                setCurrComponent={setCurrComponent}
                isComment={false}
            />
            {Object.keys(validationMessage).length > 0 &&
                <ul>
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
                </ul>
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
                    existingFile={''}
                    taskId={null}
                    setExistingFile={null}
                />:
                <RouteSetting
                    setPplInRoute={setPplInRoute}
                    pplInRoute={pplInRoute}
                    process={false}
                    isRegisteredRoute={true}
                    agentStatus={undefined}
                />
            }
            <Button
                marginTop={20}
                background={'light'}
                onClick={() => submitDraft()}
            >
                提出
            </Button>
        </>
    )
}



export default Top