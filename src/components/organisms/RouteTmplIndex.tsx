import { useState } from 'react';
import { useFetchRegisteredRoute } from '../../hooks/useRouting';
import Button from '../atoms/Button';
import RouteRegister from '../molecules/RouteRegister';
import { AdminUser } from '../../hooks/useCompany';
import { toast } from 'react-toastify';
import { authErrorMessage, http, eachErrorFlag } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';

export const RouteTmplIndex = (): React.ReactElement => {
  const [pplInRoute, setPplInRoute] = useState<AdminUser[]>([]);
  const { registerRoute } = useFetchRegisteredRoute();
  const [routeLabel, setRouteLabel] = useState<string>('');
  const setHttpStatus = useSetRecoilState(http);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);

  const register = async () => {
    if (pplInRoute.length === 0) {
      alert('ルートが未設定です。');
      return;
    }
    if (!confirm('登録しますか？')) {
      return;
    }
    setErrorMessage({ ...errorMessage, label: false });
    const res = await registerRoute(pplInRoute, routeLabel);
    if (!res.isFailure) {
      toast.success('登録しました。');
    } else {
      if (res.error.code === 422) {
        setErrorMessage({ ...errorMessage, label: res.error.message.label });
      } else {
        setHttpStatus(res.status);
      }
    }
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
