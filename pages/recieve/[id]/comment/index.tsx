import React, {useEffect, useState, useCallback} from 'react'
import {useProgress} from '../../../../hooks/useProgress'
import {useRouter} from 'next/router'
import styled from 'styled-components'
import styles from '../../../../styles/Home.module.scss'


const Comment = (): React.ReactElement => {
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
            <p className={styles.errorMessage}>{errorMessage !== undefined && errorMessage.comment}</p>
            <p>返却コメント</p>
            <Textarea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
            >
            </Textarea><br />
            <button onClick={() => submit()}>提出</button>
        </>
    )
}

const Textarea = styled.textarea`
    width: 90%;
    height: 400px;
`;

export default Comment
