import { useState, useRef } from 'react';
import OnOffBtn from '../components/atoms/OnOffBtn';
import styled from 'styled-components';
import { DEPARTMENT, SECTION } from '../const/JobInfo';
import { useDraft } from '../hooks/useDraft';
import { useRouting } from '../hooks/useRouting';
import { useEffect } from 'react';
import Select from '../components/atoms/Select';

type SectionPpl = {
  name: string;
  id: number;
};

type Props = {
  isFilled: boolean;
};

export const Agent = (props: Props): React.ReactElement => {
  const [switchVal, setSwitchVal] = useState<boolean>();
  const { fetchSectionPpl } = useDraft();
  const [sectionPpl, setSectionPpl] = useState<SectionPpl[]>();
  const { registerAgentUser, agentStatus2False, agentStatus2True, agentStatus } = useRouting();
  const [department, setDepartment] = useState<string>();
  const [section, setSection] = useState<string[]>([]);
  const depRef = useRef<HTMLSelectElement>(null);
  const sectionRef = useRef<HTMLSelectElement>(null);
  const personRef = useRef<HTMLSelectElement>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number>(null);
  const [isAllFilled, setIsAllFilled] = useState<boolean>(false);

  useEffect(() => {
    if (
      agentStatus !== undefined &&
      agentStatus !== '' &&
      typeof agentStatus !== 'string' &&
      agentStatus?.is_enabled == true
    ) {
      const switchAction = async () => {
        await setSwitchVal(true);
        belongingsAutoFill();
      };
      switchAction();
    }
  }, [agentStatus]);

  useEffect(() => {
    if (switchVal === false) {
      agentStatus2False();
      setIsAllFilled(false);
    } else if (switchVal === true) {
      const switchAction = async () => {
        await agentStatus2True();
        belongingsAutoFill();
      };
      switchAction();
    }
  }, [switchVal]);

  const belongingsAutoFill = async () => {
    if (switchVal === true && agentStatus !== '' && typeof agentStatus !== 'string' && depRef.current !== null) {
      // 部を自動入力
      depRef.current.value = agentStatus.agent_user.department;
      switchSection(depRef.current.value);
      // 課を自動入力
      sectionRef.current.value = agentStatus.agent_user.section;
      const res = await fetchSectionPpl(sectionRef.current.value);
      setSectionPpl(res);
      // DOMが読み込まれていない状態で別ページに遷移するとエラーとなるためDOMが作られてから担当を自動入力する処理を走らせる
      if (personRef.current !== null) {
        // 担当を自動入力
        personRef.current.value = agentStatus.agent_user.id;
        setIsAllFilled(true);
      }
    }
  };

  const switchSection = (dep) => {
    switch (dep) {
      case '経営企画部':
        setSection(SECTION.management);
        break;
      case '開発部':
        setSection(SECTION.dev);
        break;
    }
  };

  const depChoice = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedPersonId(null);
    // 部を変える度にselectboxを初期化
    sectionRef.current.value = 'choice';
    personRef.current.value = 'choice';
    let choiceDep: string = e.target.value;
    setDepartment(choiceDep);
    switchSection(choiceDep);
  };

  const secChoice = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPersonId(null);
    // 課を変える度にselectboxを初期化
    personRef.current.value = 'choice';
    const res = await fetchSectionPpl(e.target.value);
    setSectionPpl(res);
  };

  const selectedPerson = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const UserId: number = Number(e.target.value);
    registerAgentUser(UserId);
  };

  return (
    <>
      {agentStatus && (
        <div>
          <OnOffBtn
            setSwitchVal={setSwitchVal}
            isEnabled={typeof agentStatus !== 'string' && agentStatus?.is_enabled}
          />
          {switchVal && (
            <AgentContainer isFilled={isAllFilled}>
              <InputSubContainer>
                <Span> 部 ：</Span>
                <Select onChange={(e) => depChoice(e)} defaultValue={'choice'} ref={depRef}>
                  <option value="choice" disabled>
                    選択してください
                  </option>
                  {DEPARTMENT.map((v, index) => (
                    <option key={index} value={v}>
                      {v}
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
                  {section.map((v, index) => (
                    <option key={index} value={v}>
                      {v}
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
                  {sectionPpl?.map((person, index) => (
                    <option key={index} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </Select>
              </InputSubContainer>
            </AgentContainer>
          )}
        </div>
      )}
    </>
  );
};

const Span = styled.span`
  width: 60px;
  display: inline-block;
`;

const InputSubContainer = styled.div`
  margin: 20px 0;
`;

const AgentContainer = styled.div<Props>`
  background: gainsboro;
  text-align: center;
  width: 60%;
  margin: 30px auto;
  padding: 30px;
  border-radius: 10px;
  ${(props) => (!props.isFilled ? `visibility: hidden;` : `visibility: visible;`)}
`;

export default Agent;
