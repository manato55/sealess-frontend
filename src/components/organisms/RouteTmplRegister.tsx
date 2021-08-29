import { useEffect, useState, useRef } from 'react';
import { useRouting } from '../../hooks/useRouting';
import styled from 'styled-components';
import Select from '../atoms/Select';

type Route = {
  id: number;
  label: string;
};

export const RouteTmplRegister = (): React.ReactElement => {
  const { fetchRegisteredRoute, removeRegisteredRoute } = useRouting();
  const [selectedRoute, setSelectedRoute] = useState<{ id: number }>();
  const [registeredRoute, setRegisteredRoute] = useState<Route[]>();
  const loopCnt = 5;
  const routeRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const initialAction = async () => {
      const res = await fetchRegisteredRoute();
      setRegisteredRoute(res);
    };
    initialAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labelChoice = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const routeTmp: { id: number } = registeredRoute.find(
      (route) => route.id === Number(e.target.value)
    );
    setSelectedRoute(routeTmp);
  };

  async function removeThisRoute(): Promise<void> {
    if (!confirm('削除しますか？')) {
      return;
    }
    const res = await removeRegisteredRoute(selectedRoute.id);
    if (res) {
      const subRes = await fetchRegisteredRoute();
      setRegisteredRoute(subRes);
      setSelectedRoute(undefined);
      routeRef.current.value = 'choice';
    }
  }

  return (
    <>
      {registeredRoute ? (
        <Container>
          <Select onChange={(e) => labelChoice(e)} defaultValue={'choice'} ref={routeRef}>
            <option value="choice" disabled>
              選択してください
            </option>
            {registeredRoute !== undefined &&
              registeredRoute.map((route, index) => (
                <option key={index} value={route.id}>
                  {route.label}
                </option>
              ))}
          </Select>
          {[...Array(loopCnt)].map(
            (_, i) =>
              selectedRoute &&
              selectedRoute[`route${i}_user`] != null && (
                <RouteContainer key={i}>
                  <PplInvolved>
                    <p>関与者{i}</p>
                    <p>
                      {selectedRoute[`route${i}_user`].department.name}&emsp;
                      {selectedRoute[`route${i}_user`].section.name}&emsp;
                      {selectedRoute[`route${i}_user`].name}
                    </p>
                  </PplInvolved>
                  <ArrowBox>{selectedRoute[`route${i + 1}`] != null && <span>↓</span>}</ArrowBox>
                </RouteContainer>
              )
          )}
          {selectedRoute && (
            <DeleteBtn onClick={() => removeThisRoute()}>このルートを削除</DeleteBtn>
          )}
        </Container>
      ) : (
        'Loading'
      )}
    </>
  );
};

const ArrowBox = styled.div`
  margin-top: 15px;
`;

const DeleteBtn = styled.span`
  text-decoration: underline;
  color: blue;
  cursor: pointer;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 30px auto;
  padding: 30px;
  border-radius: 10px;
`;

const RouteContainer = styled.div`
  text-align: center;
  margin: 20px;
`;

const PplInvolved = styled.div`
  border-radius: 10px;
  background: gainsboro;
  padding: 20px;
`;

export default RouteTmplRegister;
