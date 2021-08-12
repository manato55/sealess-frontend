import React,{useState,useCallback} from 'react'
import RegisterCommonForm from '../../components/molecules/RegisterCommonForm'
import NameInput from '../../components/molecules/NameInput'
import {DEPARTMENT} from '../../const/JobInfo'
import styled from 'styled-components'
import ErrorMessageWrapper from '../../components/atoms/ErrorMessageWrapper'
import Button from '../../components/atoms/Button'
import SelectBoxWrapper from '../../components/atoms/SelectBoxWrapper'
import { useRecoilValue } from 'recoil'
import { authErrorMessage, eachErrorFlag } from '../../store/atom'
import {useAuthenticate} from '../../hooks/useAuthenticate'


type User = {
    name: string,
    email: string,
    password: string,
    department: string,
}

export const AdminTop = (): React.ReactElement => {
    const {registerDepAdmin} = useAuthenticate();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [department, setDepartment] = useState<string>('')
    const errorMessage = useRecoilValue(authErrorMessage)
    const errorFlag = useRecoilValue(eachErrorFlag)

    
    const depChoice = useCallback((e: React.ChangeEvent<HTMLSelectElement>):void => {
        let choiceDep: string = e.target.value;
        setDepartment(choiceDep)
    }, []);

    const submit = async() => {
        const user: User = {
            name: name,
            email: email,
            password: password,
            department: department,
        }
        await registerDepAdmin(user)
    }

    return (
        <Wrapper>
            <NameInput
                name={name}
                setName={setName}
            />
            <RegisterCommonForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
            />
            <ErrorMessageWrapper>{errorFlag.department && errorMessage.department}</ErrorMessageWrapper>
            <SelectBoxWrapper onChange={(e) => depChoice(e)} defaultValue={'choice'}>
                <option value="choice" disabled >部を選択してください</option>
                {DEPARTMENT.map((v,index) => 
                    <option key={index} value={v}>{v}</option>
                )}
            </SelectBoxWrapper>
            <Button
                onClick={submit}
                marginTop={20}
            >
                登録
            </Button>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    text-align: center;
    border: 0px black solid;
    width: 80%;
    margin: 100px auto;
    padding: 40px;
    border-radius: 10px;
    background-color: gainsboro;
`;


export default AdminTop