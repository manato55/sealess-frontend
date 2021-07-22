import router from 'next/router'
import React,{useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import AuthCommonForm from '../../components/auth/AuthCommonForm'
import FullName from '../../components/auth/FullName'
import {DEPARTMENT} from '../../components/info/JobInfo'
import {useAuth} from '../../hooks/useAuth'
import styled from 'styled-components'
import Common from '../../styles/Common.module.scss'


type User = {
    name: string,
    email: string,
    password: string,
    department: string,
}

export const AdminTop = (): React.ReactElement => {
    const {registerDepAdmin, errorMsg, departmentErrFlag } = useAuth();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [department, setDepartment] = useState<string>('')
    

    const depChoice = (e: React.ChangeEvent<HTMLSelectElement>):void => {
        let choiceDep: string = e.target.value;
        setDepartment(choiceDep)
    }

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
        <div className={Common.auth_wrapper}>
            <FullName
                name={name}
                setName={setName}
            />
            <AuthCommonForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
            />
            <ErrorMsg>{departmentErrFlag ? errorMsg.department: ''}</ErrorMsg>
            <SelectBoxWrapper onChange={(e) => depChoice(e)} defaultValue={'choice'}>
                <option value="choice" disabled >部を選択してください</option>
                {DEPARTMENT.map((v,index) => 
                    <option key={index} value={v}>{v}</option>
                )}
            </SelectBoxWrapper>
            <button className={Common.auth_btn} onClick={submit}>登録</button>
        </div>
    )
}


const SelectBoxWrapper = styled.select`
    width: 80%;
    height: 30px;
`;

const ErrorMsg = styled.p`
    color: red;
`;

export default AdminTop