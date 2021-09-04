import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { repository } from '../../axios/repository';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { http, userStatus } from '../../store/atom';

export const AuthCheck = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const setHttpStatus = useSetRecoilState(http);
  const [user, setUserStatus] = useRecoilState(userStatus);

  useEffect(() => {
    // user情報がstateに保持されていない場合、apiを叩いて取得できれば認証済み、取得できなければ認証前となる
    if (user === null) {
      const me = async () => {
        const res = await repository.get('me').catch((error) => error.response);
        if (res.status === 404 || res.status === 500) {
          setHttpStatus(res.status);
        } else {
          setUserStatus(res.data);
        }
      };
      me();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user) {
      if (
        !router.pathname.match('/login') &&
        !user?.id &&
        !router.pathname.match('/register/*') &&
        !user?.id &&
        !router.pathname.match('/register-admin/*') &&
        !user?.id &&
        !router.pathname.match('/password-issuance/*') &&
        !user?.id
      ) {
        router.push('/login');
        return;
      } else if (router.pathname === '/login' && user?.id) {
        router.push('/');
        return;
      }
      // admin以外がadmin,dep-admin,ownerページにアクセスしようとした場合
      if (
        (router.pathname === '/admin' && user?.user_type !== 0) ||
        (router.pathname === '/dep-admin' && user.user_type !== 1) ||
        (router.pathname === '/owner' && user.user_type !== 99)
      ) {
        router.push('/');
        return;
      }
      // adminがadminページ以外にアクセスしようとした場合
      if (!router.pathname.match('/admin*') && user?.user_type === 0) {
        router.push('/admin');
        return;
      }
      // dep-adminがdep-adminページ以外にアクセスしようとした場合
      if (!router.pathname.match('/dep-admin*') && user?.user_type === 1) {
        router.push('/dep-admin');
        return;
      }
      // ownerがownerページ以外にアクセスしようとした場合
      if (!router.pathname.match('/owner*') && user?.user_type === 99) {
        router.push('/owner');
        return;
      }
      setLoading(true);
    }
  }, [router, user]);

  return <>{loading && children}</>;
};

export default React.memo(AuthCheck);
