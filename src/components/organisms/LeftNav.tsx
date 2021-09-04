import React from 'react';
import styled from 'styled-components';
import { useAuthenticate, useLoginCheck } from '../../hooks/useAuth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userStatus, http, searchKeyword } from '../../store/atom';
import Label from '../molecules/Label';
import router from 'next/router';

export const LeftNav = (): React.ReactElement => {
  const [user, setUser] = useRecoilState(userStatus);
  const [keyword, setKeyword] = useRecoilState(searchKeyword);
  const setHttpStatus = useSetRecoilState(http);
  const { logout } = useLoginCheck();

  const onClick = async () => {
    if (!confirm('ログアウトしますか？')) {
      return;
    }
    const res = await logout();
    if (!res.isFailure) {
      setUser(undefined);
      localStorage.removeItem('token');
      // 検索キーワード削除
      setKeyword({ ...keyword, task: null, name: null, year: null });
      router.push('/login');
    } else {
      setHttpStatus(res.error.code);
    }
  };

  return (
    <>
      <NavWrapper>
        {user?.user_type === 2 ? (
          <span>
            <Label path={'/history'} tagName={'決定済み'} />
            <Label path={'/returned'} tagName={'返却案件'} />
            <Label path={'/recieve'} tagName={'受信ボックス'} />
            <Label path={'/progress/index/1'} tagName={'未承認案件'} pathMatch={'/progress/*'} />
            <Label path={'/route-tmpl'} tagName={'ルート作成'} />
            <Label path={'/unreached'} tagName={'未着案件'} />
            <Label path={'/agent'} tagName={'代理設定'} />
            <Label path={'/search/1'} tagName={'案件検索'} pathMatch={'/search*'} />
          </span>
        ) : user?.user_type === 1 ? (
          <span>
            <Label path={'/dep-admin/users'} tagName={'登録者一覧'} />
          </span>
        ) : user?.user_type === 0 ? (
          <span>
            <Label path={'/admin/register-dep-manager'} tagName={'部門管理者登録'} />
            <Label path={'/admin/dep-admin-user'} tagName={'部門管理者一覧'} />
            <Label path={'/admin/dep-register'} tagName={'部門等登録'} />
            <Label path={'/admin/dep-index'} tagName={'部門等一覧'} />
            <Label path={'/admin/all-users'} tagName={'一般登録者一覧'} />
          </span>
        ) : (
          ''
        )}
        <a onClick={() => onClick()}>
          <p>ログアウト</p>
        </a>
      </NavWrapper>
    </>
  );
};

const NavWrapper = styled.div`
  text-align: center;
  height: 100vh;

  p {
    margin: 0;
    padding: 20px 0;
  }

  p:hover {
    background: #c0c0c0;
  }

  a {
    text-decoration: none;
    color: black;
    cursor: pointer;
  }
`;

export default LeftNav;
