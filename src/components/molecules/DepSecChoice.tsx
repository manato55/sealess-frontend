import React, { Dispatch, SetStateAction, useCallback } from 'react';
import SwitchLabel from '../atoms/SwitchLabel';
import styled from 'styled-components';

type Props = {
  currComponent?: string;
  setCurrComponent?: Dispatch<SetStateAction<string>>;
  curr?: string;
};

export const DepSecChoice = (props: Props): React.ReactElement => {
  const changeTab = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
      let target = e.target as HTMLElement;
      let clicked: string = target.innerText;
      if (clicked === '部登録') {
        props.setCurrComponent('department');
      } else if (clicked === '課登録')  {
        props.setCurrComponent('section');
      } else {
        props.setCurrComponent('jobTitle');
      }
    },
    [props]
  );

  return (
    <>
      <SwitchTabContainer>
        <SwitchLabel>
          <Department id="department" onClick={(e) => changeTab(e)} curr={props.currComponent}>
            部登録
          </Department>
        </SwitchLabel>
        <SwitchLabel>
          <Section id="section" onClick={(e) => changeTab(e)} curr={props.currComponent}>
            課登録
          </Section>
        </SwitchLabel>
        <SwitchLabel>
          <JobTitle id="JobTitle" onClick={(e) => changeTab(e)} curr={props.currComponent}>
            役職登録
          </JobTitle>
        </SwitchLabel>
      </SwitchTabContainer>
    </>
  );
};

const SwitchTabContainer = styled.div`
  margin-bottom: 40px;
`;

const Department = styled.span<Props>`
  color: ${(props) => props.curr === 'department' && 'red'};
  cursor: pointer;
`;

const Section = styled.span<Props>`
  color: ${(props) => props.curr === 'section' && 'red'};
  cursor: pointer;
`;

const JobTitle = styled.span<Props>`
  color: ${(props) => props.curr === 'jobTitle' && 'red'};
  cursor: pointer;
`;

export default React.memo(DepSecChoice);
