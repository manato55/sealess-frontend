import { useState, useRef } from 'react';
import OnOffBtn from '../atoms/OnOffBtn';
import styled from 'styled-components';
import { useDraft, useFetchSectionPpl } from '../../hooks/useDraft';
import { useRouting } from '../../hooks/useRouting';
import { useEffect } from 'react';
import Select from '../atoms/Select';
import { useSetionsByDepartmentId, useDepartment } from '../../hooks/useCompany';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { http } from '../../store/atom';

interface Props {
  isFilled?: boolean;
}

export const AgentSetting = (props: Props): React.ReactElement => {
  const [sectionId, setSectionId] = useState<string>();
  const [switchVal, setSwitchVal] = useState<boolean>();
  const [departmentId, setDepartmentId] = useState<number>();
  const { fetchedSections } = useSetionsByDepartmentId(departmentId);
  const { fetchedSectionPpl } = useFetchSectionPpl(sectionId);
  const { registerAgentUser, agentStatus2False, agentStatus2True, agentStatus } = useRouting();
  const depRef = useRef<HTMLSelectElement>(null);
  const sectionRef = useRef<HTMLSelectElement>(null);
  const personRef = useRef<HTMLSelectElement>(null);
  const [isAllFilled, setIsAllFilled] = useState<boolean>(false);
  const { fetchedDepartment } = useDepartment();
  const setHttpStatus = useSetRecoilState(http);

  useEffect(() => {
    if (
      agentStatus &&
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentStatus]);

  useEffect(() => {
    if (switchVal === false) {
      const statusAction = async () => {
        const res = await agentStatus2False();
        if (!res.isFailure) {
          setIsAllFilled(false);
        } else {
          setHttpStatus(res.error.code);
        }
      };
      statusAction();
    } else if (switchVal === true) {
      const switchAction = async () => {
        const res = await agentStatus2True();
        if (!res.isFailure) {
          belongingsAutoFill();
        } else {
          setHttpStatus(res.error.code);
        }
      };
      switchAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchVal]);

  const belongingsAutoFill = async () => {
    if (agentStatus && typeof agentStatus !== 'string' && depRef.current !== null) {
      setDepartmentId(agentStatus.agent_user.department_id);
      depRef.current.value = agentStatus.agent_user.department_id;
      sectionRef.current.value = agentStatus.agent_user.section_id;
      setSectionId(agentStatus.agent_user.section_id);
      // DOMが読み込まれていない状態で別ページに遷移するとエラーとなるためDOMが作られてから担当を自動入力する処理を走らせる
      if (personRef.current !== null && fetchedSectionPpl?.length > 0) {
        // 担当を自動入力
        personRef.current.value = agentStatus.agent_user.id;
        setIsAllFilled(true);
      }
    } else {
      setIsAllFilled(true);
    }
  };

  const depChoice = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    // 部を変える度にselectboxを初期化
    sectionRef.current.value = 'choice';
    personRef.current.value = 'choice';
    let choiceDep = Number(e.target.value);
    setDepartmentId(choiceDep);
    setSectionId(null);
  };

  const secChoice = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 課を変える度にselectboxを初期化
    personRef.current.value = 'choice';
    setSectionId(e.target.value);
  };

  const selectedPerson = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userid = Number(e.target.value);
    const res = await registerAgentUser(userid);
    if (!res.isFailure) {
      toast.success('登録完了');
    } else {
      setHttpStatus(res.error.code);
    }
  };

  return (
    <>
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
          </AgentContainer>
        )}
      </div>
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
  width: 80%;
  margin: 30px auto;
  padding: 30px;
  border-radius: 10px;
  ${(props) => (!props.isFilled ? `visibility: hidden;` : `visibility: visible;`)}
`;

export default AgentSetting;
