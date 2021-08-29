import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
  taskRoute: any;
  completed?: boolean;
}

export const RouteInProgress = (props: Props): React.ReactElement => {
  const [pplInRoute, setPplInRoute] = useState<string[]>([]);
  let cnt = 0;

  const countUp = () => {
    cnt++;
  };

  const countRestore = () => {
    cnt = 0;
  };

  useEffect(() => {
    if (props.taskRoute.length > 0) {
      let keys: string[] = Object.keys(props.taskRoute[0]);
      let routeExtracted: string[] = keys.filter((v) => v.match(/route[1-5]_user/));
      setPplInRoute(routeExtracted);
    }
  }, [props.taskRoute]);

  return (
    <InputContainer>
      {pplInRoute.length > 0 &&
        pplInRoute.map((routeNum, index) => (
          <RouteContainer key={index}>
            {props.taskRoute[0][routeNum] !== null && (
              <div>
                {countRestore()}
                {index !== 0 && <p>↓</p>}
                <PplInvolved>
                  <p>
                    <Involved>関与者{index + 1}</Involved>
                    {!props.completed && routeNum.slice(0, 6) === props.taskRoute[0].process && (
                      <Holder>案件保持</Holder>
                    )}
                  </p>
                  {props.taskRoute[0].agent_statuses?.map((agent, v) => (
                    <div key={v}>
                      {`${agent.route}_user` === routeNum && (
                        <p>
                          {countUp()}
                          {agent.user.department.name}&emsp;{agent.user.section.name}&emsp;
                          {agent.user.name}
                        </p>
                      )}
                    </div>
                  ))}
                  {cnt > 0 && props.taskRoute[0][routeNum] !== null ? (
                    <Highlight>
                      {`（代理：${props.taskRoute[0][routeNum].department.name}`}&emsp;
                      {props.taskRoute[0][routeNum].section.name}&emsp;
                      {`${props.taskRoute[0][routeNum].name}）`}
                    </Highlight>
                  ) : (
                    <span>
                      {props.taskRoute[0][routeNum].deleted_at ? (
                        <span>
                          <Highlight>削除ユーザー</Highlight>(
                          {props.taskRoute[0][routeNum].department.name}&emsp;
                          {props.taskRoute[0][routeNum].section.name}&emsp;
                          {props.taskRoute[0][routeNum].name})
                        </span>
                      ) : (
                        <span>
                          {props.taskRoute[0][routeNum].department.name}&emsp;
                          {props.taskRoute[0][routeNum].section.name}&emsp;
                          {props.taskRoute[0][routeNum].name}
                        </span>
                      )}
                    </span>
                  )}
                </PplInvolved>
              </div>
            )}
          </RouteContainer>
        ))}
    </InputContainer>
  );
};

const InputContainer = styled.div`
  width: 90%;
  margin: 30px auto;
  background: gainsboro;
  padding: 30px;
  border-radius: 10px;
`;

const Involved = styled.span`
  margin-right: 20px;
`;

const Holder = styled.span`
  color: red;
`;

const Highlight = styled.p`
  color: red;
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

export default RouteInProgress;
