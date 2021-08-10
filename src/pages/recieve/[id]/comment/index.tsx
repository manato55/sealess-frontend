import React, {useEffect, useState} from 'react'
import {useProgress} from '../../../../hooks/useProgress'
import {useRouter} from 'next/router'
import Button from '../../../../components/atoms/Button'
import AddedComment from '../../../../components/organisms/AddedComment'


export const Comment = (): React.ReactElement => {
    const router = useRouter();
    const [paramsId, setParamsId] = useState<number>()
    const [comment, setComment] = useState<string>()
    const {returnToDrafter} = useProgress();
    const {errorMessage} = useProgress();

    
    useEffect(() => {
        if (router.asPath !== router.route) {
            setParamsId(Number(router.query.id));
        }
    }, [router]);

    const submit = () => {
        const data: {
            id: number;
            comment: string;
        } = {
            id: paramsId,
            comment: comment
        }
        returnToDrafter(data)
    }



    return (
        <>
            <AddedComment 
                errorMessage={errorMessage}
                setComment={setComment}
            />
            <Button 
                onClick={() => submit()}
                marginTop={20}
            >
                提出
            </Button>
        </>
    )
}


export default Comment
