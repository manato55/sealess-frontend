import React from 'react'
import {useRouter} from 'next/router'
import { useSetRecoilState } from 'recoil'
import { http } from '../store/atom'

interface Props {
    errorCode: number;
}

export const Error = (props: Props) => {
    const router = useRouter()
    const setHttpStatus = useSetRecoilState(http)


    const back = async() => {
        window.location.href = '/'
    }

    return (
        <>
            {props.errorCode === 404 ?
                <p>not found</p>
            :props.errorCode === 500 ?
                <p>server error</p>
            :''}
            <p onClick={()=>back()}>topへ戻る</p>
        </>
    )
}


export default Error