import React,{Dispatch, SetStateAction} from 'react'
import styled from 'styled-components'
import Input from '../atoms/Input'
import { useRecoilValue } from 'recoil'
import { authErrorMessage, eachErrorFlag } from '../../store/atom'


interface Props {
    setName: Dispatch<SetStateAction<string>>
    name: string,
}

export const FullName = (props: Props) => {
    const errorMessage = useRecoilValue(authErrorMessage)
    const errorFlag = useRecoilValue(eachErrorFlag)


    const nameHandler = (e: React.ChangeEvent<HTMLInputElement>):void => {
        props.setName(e.target.value)
    }

    return (
        <>
            <ErrorMsg>{errorFlag.name && errorMessage.name[0]}</ErrorMsg>
            <Input
                type="text"
                value={props.name}
                onChange={(e) => nameHandler(e)}
                placeholder='氏名'
            />
        </>
    )
}


const ErrorMsg = styled.p`
    color: red;
`;

export default FullName
