import React from 'react'
import styled from 'styled-components'
import {useAuth} from '../../hooks/useAuth'
import { useRecoilValue } from 'recoil'
import { userStatus } from '../../store/atom'
import Label from '../molecules/Label'

export const LeftNav = () => {
    const {logout}  = useAuth();
    const user = useRecoilValue(userStatus)

    return (
        <>
            <NavWrapper>
                {user?.user_type === 2 &&
                    <span>
                        <Label
                            path={'/history'}
                            tagName={'決定済み'}
                        />
                        <Label
                            path={'/returned'}
                            tagName={'返却案件'}
                        />
                        <Label
                            path={'/recieve'}
                            tagName={'受信ボックス'}
                        />
                        <Label
                            path={'/progress/index/1'}
                            tagName={'未承認案件'}
                            pathMatch={'/progress/*'}
                        />
                        <Label
                            path={'/route-tmpl'}
                            tagName={'ルート作成'}
                        />
                        <Label
                            path={'/unreached'}
                            tagName={'未着案件'}
                        />
                        <Label
                            path={'/agent'}
                            tagName={'代理設定'}
                        />
                        <Label
                            path={'/search/1'}
                            tagName={'案件検索'}
                            pathMatch={'/search*'}
                        />
                    </span>
                }
                <a onClick={logout}><p>ログアウト</p></a>
            </NavWrapper>
        </>
    )
}

const NavWrapper = styled.div`
    text-align: center;

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
        cursor: pointer
    }
`;

export default LeftNav