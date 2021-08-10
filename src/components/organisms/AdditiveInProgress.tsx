import React, {useEffect, useState} from 'react'
import {useProgress} from '../../hooks/useProgress'

type TopProps = {
    filename: string;
    taskId: number;
}

export const AdditiveInProgress = (props: TopProps): React.ReactElement => {
    const [files, setFiles] = useState<string[]>([])
    const {downloadFile} = useProgress()
    
    useEffect(() => {
        const fetchFiles = async() => {
            if(props.filename !== null) {
                const fileTmp = props.filename.split(',')
                setFiles(fileTmp)
            } else {
                setFiles(null)
            }
        }
        fetchFiles()
    },[props.filename]);

    const download = (e: React.MouseEvent<HTMLSpanElement,MouseEvent> ):void => {
        const data:{filename: string; id: number} = {
            filename:e.currentTarget.innerHTML,
            id: props.taskId
        } 
        downloadFile(data)
    }

    return (
        <>
            {files !== null && files.length !== 0 && files.map((file,index) => 
                <ul key={index}>
                    <li onClick={(e) => download(e)}>{file}</li>
                </ul>
            )}
        </>
    )
}


export default AdditiveInProgress