import React,{useState, useEffect, useRef, RefObject} from 'react'
import BasicInfo from '../components/draft/BasicInfo'
import Additives from '../components/draft/Additives'
import Routing from '../components/draft/Routing'
import SwitchTab from '../components/layouts/SwitchTab'
import styled from 'styled-components'
import {useDraft} from '../hooks/useDraft'
import { toast } from 'react-toastify'
import styles from '../styles/Home.module.scss'
import Button from '../components/layouts/Button'


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
            <SwitchTab 
                currComponent={currComponent}
                setCurrComponent={setCurrComponent}
                isComment={false}
            />
            {Object.keys(validationMessage).length > 0 ? 
                <ul>
                    <li className={styles.errorMessage}>{validationMessage.title}</li>
                    <li className={styles.errorMessage}>{validationMessage.content}</li>
                    <li className={styles.errorMessage}>{validationMessage.route}</li>
                    {fileNumber.length !== 0 ? fileNumber.map((file,index) => 
                        <li key={index} className={styles.errorMessage}>{validationMessage[file][0]}</li>
                    ):''}
                </ul>
            :''}
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
                <Routing
                    setPplInRoute={setPplInRoute}
                    pplInRoute={pplInRoute}
                    process={false}
                    isRegisteredRoute={true}
                />
            }<br/>
            <SubmitBtnContainer>
                <Button
                    background="red"
                    onClick={() => submitDraft()}
                >
                    提出
                </Button>
            </SubmitBtnContainer>
        </>
    )
}

const SubmitBtnContainer = styled.div`
    margin-top: 50px;
    text-align: center;

    button {
        width: 50%;
    }
    
`;


export default Top