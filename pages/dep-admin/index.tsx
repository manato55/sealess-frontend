import React,{useEffect, useState} from 'react'
import Email from '../../components/auth/Email'
import FullName from '../../components/auth/FullName'
import {DEPARTMENT, SECTION, JOBTITLE } from '../../components/info/JobInfo'
import {useAuth} from '../../hooks/useAuth'
import styled from 'styled-components'
import Common from '../../styles/Common.module.scss'
import { useRecoilValue } from 'recoil'
import { userStatus } from '../../store/atom'



type User = {
    name: string;
    email: string;
    department: string;
    section: string;
    jobTitle: string;
}


export const DepAdmin = (): React.ReactElement => {
    const {registerOrdinaryUser, errorMsg, sectionErrFlag, jobTitleErrFlag } = useAuth();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [section, setSection] = useState<string[]>()
    const [selectedSection, setSelectedSection] = useState<string>('')
    const [jobTitle, setJobTitle] = useState<string>('')
    const user = useRecoilValue(userStatus)


    useEffect(() => {
        if(user?.id) {
            switch(user.department) {
                case('経営企画部'):
                    setSection(SECTION.management)
                break;
                case('開発部'):
                    setSection(SECTION.dev)
                break;
            }
        }
    }, [user])    

    const secChoice = (e: React.ChangeEvent<HTMLSelectElement>):void => {
        const choiceSec: string = e.target.value;
        setSelectedSection(choiceSec)
    }

    const submit = async() => {
        const registerUser: User = {
            name: name,
            email: email,
            department: user.department,
            section: selectedSection,
            jobTitle: jobTitle,
        }
        await registerOrdinaryUser(registerUser)
    }
    
    return (
        <div className={Common.auth_wrapper}>
            <FullName
                name={name}
                setName={setName}
            />
            <Email
                email={email}
                setEmail={setEmail}
            />
            <ErrorMsg>{sectionErrFlag && errorMsg.section[0]}</ErrorMsg>
            <SelectBoxWrapper onChange={(e) => secChoice(e)} defaultValue={'choice'}>
                <option value="choice" disabled >課を選択してください</option>
                {section !== undefined && section.map((v,index) => 
                    <option key={index} value={v}>{v}</option>
                )}
            </SelectBoxWrapper>
            <ErrorMsg>{jobTitleErrFlag && errorMsg.jobTitle[0]}</ErrorMsg>
            <SelectBoxWrapper onChange={(e) => setJobTitle(e.target.value)} defaultValue={'choice'}>
                <option value="choice" disabled >役職を選択してください</option>
                {JOBTITLE.map((v,index) => 
                    <option key={index} value={v}>{v}</option>
                )}
            </SelectBoxWrapper>
            <button className={Common.auth_btn} onClick={submit}>登録</button>
        </div>
    )
}


const ErrorMsg = styled.p`
    color: red;
`;

const SelectBoxWrapper = styled.select`
    width: 80%;
    height: 30px;
`;

export default DepAdmin