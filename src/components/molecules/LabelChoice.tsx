import React, { Dispatch, SetStateAction, useCallback } from 'react';
import SwitchLabel from '../atoms/SwitchLabel';
import styled from 'styled-components';

type Props = {
  currComponent?: string;
  isComment?: boolean;
  setCurrComponent?: Dispatch<SetStateAction<string>>;
  curr?: string;
};

export const LabelChoice = (props: Props): React.ReactElement => {
  const changeTab = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
      let target = e.target as HTMLElement;
      let clicked: string = target.innerText;
      if (clicked === '基本情報') {
        props.setCurrComponent('basic');
      } else if (clicked === '添付書類') {
        props.setCurrComponent('additive');
      } else if (clicked === 'ルート') {
        props.setCurrComponent('route');
      } else {
        props.setCurrComponent('comment');
      }
    },
    [props]
  );

  return (
    <>
      <SwitchTabContainer>
        <SwitchLabel>
          <Basic id="basic" onClick={(e) => changeTab(e)} curr={props.currComponent}>
            基本情報
          </Basic>
        </SwitchLabel>
        <SwitchLabel>
          <Adds id="adds" onClick={(e) => changeTab(e)} curr={props.currComponent}>
            添付書類
          </Adds>
        </SwitchLabel>
        <SwitchLabel>
          <Route id="route" onClick={(e) => changeTab(e)} curr={props.currComponent}>
            ルート
          </Route>
        </SwitchLabel>
        {props.isComment && (
          <SwitchLabel>
            <Comment id="comment" curr={props.currComponent} onClick={(e) => changeTab(e)}>
              返却コメント
            </Comment>
          </SwitchLabel>
        )}
      </SwitchTabContainer>
    </>
  );
};

const SwitchTabContainer = styled.div`
  margin-bottom: 40px;
`;

const Basic = styled.span<Props>`
  color: ${(props) => props.curr === 'basic' && 'red'};
  cursor: pointer;
`;

const Adds = styled.span<Props>`
  color: ${(props) => props.curr === 'additive' && 'red'};
  cursor: pointer;
`;

const Route = styled.span<Props>`
  color: ${(props) => props.curr === 'route' && 'red'};
  cursor: pointer;
`;

const Comment = styled.span<Props>`
  color: ${(props) => props.curr === 'comment' && 'red'};
  cursor: pointer;
`;

export default React.memo(LabelChoice);
