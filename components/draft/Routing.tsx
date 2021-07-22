import React, { useEffect, useState, Dispatch, SetStateAction, useRef } from 'react';
import {DEPARTMENT, SECTION, JOBTITLE } from '../info/JobInfo'
import {useDraft} from '../../hooks/useDraft'
import styled from 'styled-components';
import Common from '../../styles/Common.module.scss'
import {useRoute} from '../../hooks/useRoute'



type TopProps = {
    setPplInRoute: Dispatch<SetStateAction<{}>>;
    pplInRoute: {}[];
    process: number|boolean|string;
    isRegisteredRoute: boolean;
}

export const Routing = (props: TopProps) => {
    const {fetchSectionPpl, sectionPpl} = useDraft();
    const {fetchRegisteredRoute, registeredRoute} = useRoute()
    const [department, setDepartment] = useState<string>()
    const [section, setSection] = useState([])
    const sectionRef = useRef<HTMLSelectElement>(null)
    const personRef = useRef<HTMLSelectElement>(null)
    const [selectedPersonId, setSelectedPersonId] = useState<number>(null)
    const [pplInRouteChild, setPplInRouteChild] = useState<any[]>(props.pplInRoute)
    const [selectedRoute, setSelectedRoute] = useState<{id:number}>()
    const loopCnt: number = 5;
    const routeRef = useRef<HTMLSelectElement>(null)


    useEffect(() => {
        const initialAction = async() => {
            await fetchRegisteredRoute()
        }
        initialAction()
    }, [])

    const depChoice = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedPersonId(null)
        // 部を変える度にselectboxを初期化
        sectionRef.current.value = 'choice'
        personRef.current.value = 'choice'
        let choiceDep: string = e.target.value;
        setDepartment(choiceDep)
        switch(choiceDep) {
            case('経営企画部'):
                setSection(SECTION.management);
            break;
            case('開発部'):
                setSection(SECTION.dev);
            break;
        }
    }

    const secChoice = async(e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPersonId(null)
        // 課を変える度にselectboxを初期化
        personRef.current.value = 'choice'
        await fetchSectionPpl(e.target.value);
    }

    const selectedPerson = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedPersonId(Number(e.target.value))
    }

    const addPersonToRoute = () => {
        if(selectedPersonId === null) {
            alert('関与者を選択してください。');
            return;
        }
        if(pplInRouteChild.length > 4) {
            alert('関与者は最大５人まで設定可能です。');
            return;
        }
        let addedToRoute: {id: number} = sectionPpl.find((person: {id: number}) => person.id === selectedPersonId)
        // 関与者重複判定
        let cnt: number = 0;
        pplInRouteChild.map(person => {
            if(person.id === addedToRoute.id) {
                alert('関与者が重複しています。')
                cnt++
            }
        })
        if(cnt > 0) return;

        props.setPplInRoute([...props.pplInRoute, addedToRoute])
        setPplInRouteChild([...pplInRouteChild, addedToRoute])
    }

    const removeInvolvedPerson = (order: number) => {
        const spreaded: string[] = [...pplInRouteChild]
        spreaded.splice(order,1)
        setPplInRouteChild(spreaded)
        props.setPplInRoute(spreaded)
    }

    const labelChoice = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const routeTmp: {id:number} = registeredRoute.find(route => route.id === Number(e.target.value))
        setSelectedRoute(routeTmp)
        let routeArrTmp:object[] = []
        for(let i:number=1;i<loopCnt;i++) {
            if(routeTmp[`route${i}_user`] !== null) {
                routeArrTmp.push(routeTmp[`route${i}_user`])
            }
        }
        props.setPplInRoute(routeArrTmp)
        setPplInRouteChild(routeArrTmp)
    }

    return (
        <>
            <div className={Common.input_container}>
                {props.isRegisteredRoute &&
                    <div>
                        <span>登録済みルート</span>
                        <select onChange={(e) => labelChoice(e)} defaultValue={'choice'} ref={routeRef}>
                            <option value="choice" disabled>選択してください</option>
                            {registeredRoute !== undefined && registeredRoute.map((route,index) => 
                                <option key={index} value={route.id}>{route.label}</option>
                            )}
                        </select>
                    </div>
                }
                <InputSubContainer>
                    <span>部：</span>
                    <select onChange={(e) => depChoice(e)} defaultValue={'choice'}>
                        <option value="choice" disabled>選択してください</option>
                        {DEPARTMENT.map((v,index) => 
                            <option key={index} value={v}>{v}</option>
                        )}
                    </select>
                </InputSubContainer>
                <InputSubContainer>
                    <span>課：</span>
                    <select onChange={(e) => secChoice(e)} defaultValue={'choice'} ref={sectionRef}>
                        <option value="choice" disabled>選択してください</option>
                        {section.map((v,index) => 
                            <option key={index} value={v}>{v}</option>
                        )}
                    </select>
                </InputSubContainer>
                <InputSubContainer>
                    <span>担当：</span>
                    <select onChange={(e) => selectedPerson(e)} defaultValue={'choice'} ref={personRef}>
                        <option value="choice" disabled>選択してください</option>
                        {sectionPpl.map((person, index) =>
                            <option key={index} value={person.id}>{person.name}</option>
                        )}
                    </select>
                </InputSubContainer>
                <button onClick={addPersonToRoute}>追加</button>
                {pplInRouteChild.map((person,index) => 
                    <div className={Common.route_container} key={index}>
                        {index !== 0 ? <p>↓</p>: ''}
                        <Wrapper>
                            <div className={Common.ppl_involved}>
                                <p>関与者{index + 1}</p>
                                <p>{person.department}&emsp;{person.section}&emsp;{person.name}</p>
                            </div>
                            <DeleteBox>
                                {/* 既に承認済みの関与者はルートから変更できなくする*/}
                                {pplInRouteChild.length - index === 1 && pplInRouteChild.length >= Number(props.process) ? 
                                    <span onClick={() => removeInvolvedPerson(index)}>×</span>
                                :''}
                            </DeleteBox>
                        </Wrapper>
                    </div>
                )}
            </div>
        </>
    )
}


const Wrapper = styled.div`
    display: flex;
`;

const  InputSubContainer = styled.div`
    margin: 20px 0;
`;

const DeleteBox = styled.div`
    position: relative;
    right: 30px;
    top: 30px;
    font-size: 20px;
    cursor: pointer;
`;

export default Routing
