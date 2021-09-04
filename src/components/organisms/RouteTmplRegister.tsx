import { useEffect, useState, useRef } from 'react';
import { useFetchRegisteredRoute } from '../../hooks/useRouting';
import styled from 'styled-components';
import Select from '../atoms/Select';
import { toast } from 'react-toastify';
import { http } from '../../store/atom';
import { useSetRecoilState } from 'recoil';

export const RouteTmplRegister = (): React.ReactElement => {
  const { registeredRoute, removeRegisteredRoute } = useFetchRegisteredRoute();
  const [selectedRoute, setSelectedRoute] = useState<{ id: number }>();
  const loopCnt = 5;
  const routeRef = useRef<HTMLSelectElement>(null);
  const setHttpStatus = useSetRecoilState(http);

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
    if (!res.Failure) {
      toast.success('削除しました。');
      setSelectedRoute(undefined);
      routeRef.current.value = 'choice';
    } else {
      setHttpStatus(res.status);
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
