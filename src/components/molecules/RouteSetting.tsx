import React, { useEffect, useState, Dispatch, SetStateAction, useRef, useCallback } from 'react';
import { useFetchSectionPpl } from '../../hooks/useDraft';
import styled from 'styled-components';
import { useFetchRegisteredRoute } from '../../hooks/useRouting';
import Select from '../atoms/Select';
import { useSetionsByDepartmentId, useDepartment } from '../../hooks/useCompany';

interface Props {
  setPplInRoute: Dispatch<SetStateAction<object>>;
  pplInRoute: object[];
  process: number | boolean | string;
  isRegisteredRoute: boolean;
  agentStatus: {
    route: string;
    user: {
      name: string;
      department: string;
      section: string;
    };
    agent_user: number;
  }[];
}

export const Routing = (props: Props): React.ReactElement => {
  const { fetchedDepartment } = useDepartment();
  const [departmentId, setDepartmentId] = useState<number>();
  const { fetchedSections } = useSetionsByDepartmentId(departmentId);
  const [sectionId, setSectionId] = useState<number>();
  const { fetchedSectionPpl } = useFetchSectionPpl(sectionId);
  const { registeredRoute } = useFetchRegisteredRoute();
  const sectionRef = useRef<HTMLSelectElement>(null);
  const personRef = useRef<HTMLSelectElement>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number>(null);
  const [pplInRouteChild, setPplInRouteChild] = useState<any[]>(props.pplInRoute);
  const [selectedRoute, setSelectedRoute] = useState<{ id: number }>();
  const routeRef = useRef<HTMLSelectElement>(null);
  const loopCnt = 5;
  let cnt = 0;

  const countUp = () => {
    cnt++;
  };

  const countRestore = () => {
    cnt = 0;
  };

  const depChoice = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSectionId(null);
    // 部を変える度にselectboxを初期化
    sectionRef.current.value = 'choice';
    personRef.current.value = 'choice';
    const choiceDep = Number(e.target.value);
    setDepartmentId(choiceDep);
  }, []);

  const secChoice = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 課を変える度にselectboxを初期化
    personRef.current.value = 'choice';
    setSectionId(Number(e.target.value));
  }, []);

  const selectedPerson = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      setSelectedPersonId(Number(e.target.value));
    },
    [setSelectedPersonId]
  );

  const addPersonToRoute = () => {
    if (selectedPersonId === null) {
      alert('関与者を選択してください。');
      return;
    }
    if (pplInRouteChild?.length > 4) {
      alert('関与者は最大５人まで設定可能です。');
      return;
    }
    let addedToRoute: { id: number } = fetchedSectionPpl.find(
      (person: { id: number }) => person.id === selectedPersonId
    );
    // 関与者重複判定
    let cnt = 0;
    pplInRouteChild?.map((person) => {
      if (person.id === addedToRoute.id) {
        alert('関与者が重複しています。');
        cnt++;
      }
    });
    if (cnt > 0) return;

    props.setPplInRoute([...props.pplInRoute, addedToRoute]);
    setPplInRouteChild([...pplInRouteChild, addedToRoute]);
  };

  const removeInvolvedPerson = (order: number) => {
    const spreaded: string[] = [...pplInRouteChild];
    spreaded.splice(order, 1);
    setPplInRouteChild(spreaded);
    props.setPplInRoute(spreaded);
  };

  const labelChoice = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      const routeTmp: { id: number } = registeredRoute.find(
        (route) => route.id === Number(e.target.value)
      );
      setSelectedRoute(routeTmp);
      let routeArrTmp: object[] = [];
      for (let i = 1; i < loopCnt; i++) {
        if (routeTmp[`route${i}_user`] !== null) {
          routeArrTmp.push(routeTmp[`route${i}_user`]);
        }
      }
      props.setPplInRoute(routeArrTmp);
      setPplInRouteChild(routeArrTmp);
    },
    [props, registeredRoute]
  );

  return (
    <>
      <Container>
        {props.isRegisteredRoute && (
          <div>
            <span>登録済みルート：</span>
            <select
              id="selected"
              onChange={(e) => labelChoice(e)}
              defaultValue={'choice'}
              ref={routeRef}
            >
              <option value="choice" disabled>
                選択してください
              </option>
              {registeredRoute?.map((route, index) => (
                <option key={index} value={route.id}>
                  {route.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <InputSubContainer>
          <Span> 部 ：</Span>
          <Select onChange={(e) => depChoice(e)} defaultValue={'choice'}>
            <option value="choice" disabled>
              選択してください
            </option>
            {fetchedDepartment?.map((v, index) => (
              <option key={index} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>
        </InputSubContainer>
        <InputSubContainer>
          <Span> 課 ：</Span>
          <Select onChange={(e) => secChoice(e)} defaultValue={'choice'} ref={sectionRef}>
            <option value="choice" disabled>
              選択してください
            </option>
            {fetchedSections?.map((v, index) => (
              <option key={index} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>
        </InputSubContainer>
        <InputSubContainer>
          <Span>担当：</Span>
          <Select onChange={(e) => selectedPerson(e)} defaultValue={'choice'} ref={personRef}>
            <option value="choice" disabled>
              選択してください
            </option>
            {fetchedSectionPpl?.map((person, index) => (
              <option key={index} value={person.id}>
                {person.name}
              </option>
            ))}
          </Select>
        </InputSubContainer>
        <button onClick={addPersonToRoute}>追加</button>
        {pplInRouteChild?.map((person, index) => (
          <RouteContainer key={index}>
            {countRestore()}
            {index !== 0 && <p>↓</p>}
            <Wrapper>
              <PplInvolved>
                <p>関与者{index + 1}</p>
                {props.agentStatus?.map((agent, v) => (
                  <p key={v}>
                    {agent.route.slice(-1) == String(index + 1) && agent.agent_user == person.id && (
                      <span>
                        {countUp()}
                        {agent.user.department}&emsp;{agent.user.section}&emsp;{agent.user.name}
                      </span>
                    )}
                  </p>
                ))}
                {cnt > 0 ? (
                  <AgentPerson>
                    {`（代理：${person.department}`}&emsp;{person.section}&emsp;{`${person.name}）`}
                  </AgentPerson>
                ) : (
                  <p>
                    {person.department.name}&emsp;{person.section.name}&emsp;{person.name}
                  </p>
                )}
              </PplInvolved>
              <DeleteBox>
                {/* 既に承認済みの関与者はルートから変更できなくする*/}
                {pplInRouteChild?.length - index === 1 &&
                  pplInRouteChild.length >= Number(props.process) && (
                    <span onClick={() => removeInvolvedPerson(index)}>×</span>
                  )}
              </DeleteBox>
            </Wrapper>
          </RouteContainer>
        ))}
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 30px auto;
  background: gainsboro;
  padding: 30px;
  border-radius: 10px;
`;

const Span = styled.span`
  width: 60px;
  display: inline-block;
`;

const RouteContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const PplInvolved = styled.div`
  width: 80%;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
`;

const Wrapper = styled.div`
  display: flex;
`;

const InputSubContainer = styled.div`
  margin: 20px 0;
`;

const DeleteBox = styled.div`
  margin: auto 0;
  font-size: 25px;
  cursor: pointer;
`;

const AgentPerson = styled.span`
  color: red;
`;

export default React.memo(Routing);
