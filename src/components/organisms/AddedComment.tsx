import React, {Dispatch, SetStateAction} from 'react'
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper'
import TextArea from '../atoms/TextArea'


interface Props {
    errorMessage: {
        comment?: string;
    }
    setComment: Dispatch<SetStateAction<string>>;
}

export const AddedComment = (props: Props): React.ReactElement => {
    return (
        <>
            <ErrorMessageWrapper>{props.errorMessage && props.errorMessage.comment}</ErrorMessageWrapper>
            <p>返却コメント</p>
            <TextArea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => props.setComment(e.target.value)}
            >
            </TextArea>
        </>
    )
}

export default AddedComment