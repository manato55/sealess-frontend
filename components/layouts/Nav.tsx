import React, {useRef, useEffect} from 'react'
import Header from '../../styles/Header.module.scss';
import Link from 'next/link';
import {useAuth} from '../../hooks/useAuth'
import {useGlobal} from '../../hooks/useGlobal'
import {useRouter} from 'next/router'
import media from "styled-media-query";
import styled from 'styled-components'


export const Nav = () => {
    const menuBtnCheck = useRef<HTMLInputElement>(null)
    const {logout, me, user}  = useAuth();
    const {token} = useGlobal();
    const router = useRouter()

    const link = (): void => {
        menuBtnCheck.current.checked = false
    }

    useEffect(() => {
        const initialAction = async() => {
            await me()
        }
        initialAction()
    }, [router])

    return (
        <>
            <header className={Header.header}>
                <h3 className={Header.product_name}>
                    {user !== undefined && user.user_type === 2 ? 
                        <Link href="/">
                            <a className={Header.top_link}>sealess</a>
                        </Link>    
                    :
                        <span>sealess</span>
                    }
                </h3>
                {user?.message === undefined ? 
                    <MobileDiv className={Header.hamburger_menu}>
                        <input type="checkbox" id="menu_btn_check" className={Header.menu_btn_check} ref={menuBtnCheck} />
                        <label htmlFor="menu_btn_check" className={Header.menu_btn}><span></span></label>
                        <div className={Header.menu_content}>
                            <ul onClick={link}>
                                {user !== undefined && user.user_type === 2 ?
                                    <span>
                                        <List><Link href="/history"><a>決定済み</a></Link></List>
                                        <List><Link href="/returned"><a>返却案件</a></Link></List>
                                        <List><Link href="/recieve"><a>受信ボックス</a></Link></List>
                                        <List><Link href="/progress/index/1"><a>未承認案件</a></Link></List>
                                        <List><Link href="/route-tmpl"><a>ルート作成</a></Link></List>
                                        <List><Link href="/unreached"><a>未着案件</a></Link></List>
                                        <List><Link href="/agent"><a>代理設定</a></Link></List>
                                        <List><Link href="/search/1"><a>案件検索</a></Link></List>
                                    </span>
                                :''}
                                <List><a className={Header.logout_btn} onClick={logout}>ログアウト</a></List>
                            </ul>
                        </div>
                    </MobileDiv>
                :''}
            </header>
        </>
    )
}


const MobileDiv = styled.div`
    ${media.greaterThan("medium")`
    display: none;
    `}
`;
const List = styled.li`
	cursor: pointer;
`;

export default Nav
