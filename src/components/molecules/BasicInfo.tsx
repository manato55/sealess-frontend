import React, {Dispatch,SetStateAction,useCallback} from 'react'
import Input from '../atoms/Input'
import TextArea from '../atoms/TextArea'

interface Props {
    setTitle?: Dispatch<SetStateAction<string>>
    setContents?: Dispatch<SetStateAction<string>>
    title: string;
    contents: string;
    editable?: boolean;
}

export const BasicInfo = (props: Props): React.ReactElement => {

    const titleHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setTitle(e.target.value)
    }, [props]);

    const contentsHandler = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>):void => {
        props.setContents(e.target.value)
    }, [props]);

    return (
        <>
            <p>件名</p>
            <Input
                type="text"
                value={props.title}
                onChange={(e) => titleHandler(e)}
                editable={props.editable}
            />
            <p>説明文</p>
            <TextArea 
                value={props.contents}
                onChange={(e) => contentsHandler(e)}
                editable={props.editable}
            />
        </>
    )
}


export default BasicInfo