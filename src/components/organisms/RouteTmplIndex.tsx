import { useState } from 'react';
import { useRouting } from '../../hooks/useRouting';
import Button from '../atoms/Button';
import RouteRegister from '../molecules/RouteRegister';
import { AdminUser } from '../../hooks/useUser';

export const RouteTmplIndex = (): React.ReactElement => {
  const [pplInRoute, setPplInRoute] = useState<AdminUser[]>([]);
  const { registerRoute } = useRouting();
  const [routeLabel, setRouteLabel] = useState<string>('');

  const register = (): void => {
    if (pplInRoute.length === 0) {
      alert('ルートが未設定です。');
      return;
    }
    if (!confirm('登録しますか？')) {
      return;
    }
    registerRoute(pplInRoute, routeLabel);
  };

  return (
    <>
      <RouteRegister
        pplInRoute={pplInRoute}
        setRouteLabel={setRouteLabel}
        setPplInRoute={setPplInRoute}
      />
      <Button onClick={() => register()} marginTop={20}>
        登録
      </Button>
    </>
  );
};

export default RouteTmplIndex;
