import {useState, RefObject, useImperativeHandle, useEffect, Dispatch, SetStateAction, useRef, useCallback} from 'react'
import {useProgress} from '../../hooks/useProgress'
import {useReturned} from '../../hooks/useReturned'
import styled from 'styled-components'

type TopProps = {
    setFile: Dispatch<SetStateAction<File[]>>;
    fileRef:  RefObject<HTMLInputElement>;
    setFileState: Dispatch<SetStateAction<any>>;
    existingFile: string;
    taskId: number;
    setExistingFile: Dispatch<SetStateAction<string>>
}



export const Additives = (props: TopProps): React.ReactElement => { 
    const [exstingFilename, setExistingFilename] = useState<string[]>([])
    const {downloadFile} = useProgress()
    const {removeFile, fileRemoval, fileRemovalTofalse} = useReturned()
    const [removingFile, setRemovingFile] = useState<string>(null)
    

    const handleChangeFile = useCallback((e: React.ChangeEvent<HTMLInputElement>):void => {
        const files = []
        let upFile = e.target.files
        for(let i=0;i<upFile.length;i++) {
            files.push(upFile[i]);
        }
        props.setFile(files)
    }, [props]);

    useEffect(() => {
        if(props.existingFile !== '' && props.existingFile !== null) {
            let fileTmp = props.existingFile.split(',')
            setExistingFilename(fileTmp);
        } else {
            setExistingFilename(null)
        }
    }, [props.existingFile])

    const download = (e: React.MouseEvent<HTMLSpanElement,MouseEvent> ):void => {
        const data:{filename: string; id: number} = {
            filename:e.currentTarget.innerHTML,
            id: props.taskId
        } 
        downloadFile(data)
    }

    async function remove(filename): Promise<void> {
        if(!confirm('削除しますか？')) {
            return
        }
        setRemovingFile(filename)
        const data:{filename: string; id: number} = {
            filename: filename,
            id: props.taskId
        }
        await removeFile(data)
    }

    useEffect(() => {
        // DBでのファイル削除に成功したら表示を消す
        if(fileRemoval) {
            let index = exstingFilename.indexOf(removingFile)
            let newFilename = [...exstingFilename]
            newFilename.splice(index,1)
            setExistingFilename(newFilename)

            // propsで受けたっとexistingFileの値を更新
            let filenameForProps: string = ''
            newFilename.map(file => {
                filenameForProps += file+','
            })
            let slicedFilename: string = filenameForProps.slice(0,-1)
            props.setExistingFile(slicedFilename)
        }
        fileRemovalTofalse();
    }, [fileRemoval])


    return (
        <>
            <div>
                <input 
                    type="file"
                    ref={props.fileRef}
                    onChange={handleChangeFile}
                    multiple
                />
                <div>
                    {props.existingFile !== '' && props.existingFile !== null && 
                        exstingFilename.map((filename, index) => 
                            <ul key={index}>
                                <li>
                                    <span onClick={(e) => download(e)}>{filename}</span> 
                                    <RemoveFileBtn onClick={() => remove(filename)}>✘</RemoveFileBtn>
                                </li>
                            </ul>
                        )
                    }
                </div>
            </div>
        </>
    )
}

const RemoveFileBtn = styled.span`
    cursor: pointer;
    margin-left: 30px;
`;


export default Additives