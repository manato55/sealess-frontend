import React,{useEffect,useState} from 'react'
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper'
import { useRecoilValue, useRecoilState } from 'recoil'
import { eachErrorFlag, authErrorMessage } from '../../store/atom'


interface Props {
    
}



export const DraftValidataionError = (props: Props) => {
    const [fileNumber, setFileNumber] = useState<string[]>([])
    const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag)
    const errorMessage = useRecoilValue(authErrorMessage)

    useEffect(() => {
        return () => {
            setErrorFlag({...errorFlag, file: false, title:false, content: false, route: false})
            setFileNumber([])
        }
    }, []);

    useEffect(() => {
        // 添付したファイル数に応じてエラーを表示する
        if(errorFlag.file) {
            let keys: string[] = Object.keys(errorMessage)
            let fileExtracted: string[] = keys.filter(v => v.match(/file/))
            setFileNumber(fileExtracted)
        }
    }, [errorFlag])

    return (
        <>
            <ErrorMessageWrapper>{errorFlag.title && errorMessage.title[0]}</ErrorMessageWrapper>
            <ErrorMessageWrapper>{errorFlag.content && errorMessage.content[0]}</ErrorMessageWrapper>
            <ErrorMessageWrapper>{errorFlag.route && errorMessage.route[0]}</ErrorMessageWrapper>
            {errorFlag.file && fileNumber.map((file,index) => 
                <ErrorMessageWrapper key={index}>{errorMessage[file][0]}</ErrorMessageWrapper>
            )}
        </>
    )
}

export default DraftValidataionError