import React, { Dispatch, SetStateAction, useCallback } from 'react';
import SwitchLabel from '../atoms/SwitchLabel';
import styled from 'styled-components';

type Props = {
  currComponent?: string;
  setCurrComponent?: Dispatch<SetStateAction<string>>;
  curr?: string;
};

export const DepJobTitleChoices = (props: Props): React.ReactElement => {
  const changeTab = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
      let target = e.target as HTMLElement;
      let clicked: string = target.innerText;
      if (clicked === '部門一覧') {
        props.setCurrComponent('department');
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
            部門一覧
          </Department>
        </SwitchLabel>
        <SwitchLabel>
          <JobTitle id="JobTitle" onClick={(e) => changeTab(e)} curr={props.currComponent}>
            役職一覧
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

const JobTitle = styled.span<Props>`
  color: ${(props) => props.curr === 'jobTitle' && 'red'};
  cursor: pointer;
`;

export default React.memo(DepJobTitleChoices);
