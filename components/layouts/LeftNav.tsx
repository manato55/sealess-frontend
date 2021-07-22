import {useState,useEffect} from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import {useRouter} from 'next/router'
import mediaQuery from "styled-media-query";
import {useAuth} from '../../hooks/useAuth'


export const LeftNav = () => {
    const router = useRouter()
    const {logout, me, user}  = useAuth();
    const [currentPathname, setCurrentPathname] = useState<string>('')

    useEffect(() => {
        const initialAction = async() => {
            await me()
        }
        initialAction()
    }, [router])

    useEffect(() => {
        setCurrentPathname(router.pathname)
    }, [router.pathname])

    return (
        <Flex>
            <NavBox>
                {user?.user_type === 2 ?
                    <span>
                        <Link href="/history">
                            <a>
                                {currentPathname.match('/history*') ? 
                                    <CurrentTab>決定済み</CurrentTab>
                                    :<p>決定済み</p>
                                }
                            </a>
                        </Link>
                        <Link href="/returned">
                            <a>
                                {currentPathname.match('/returned*') ? 
                                    <CurrentTab>返却案件</CurrentTab>
                                    :<p>返却案件</p>
                                }
                            </a>
                        </Link>
                        <Link href="/recieve">
                            <a>
                                {currentPathname.match('/recieve*') ? 
                                    <CurrentTab>受信ボックス</CurrentTab>
                                    :<p>受信ボックス</p>
                                }
                            </a>
                        </Link>
                        <Link href="/progress/index/1">
                            <a>
                                {currentPathname.match('/progress/*') ? 
                                    <CurrentTab>未承認案件</CurrentTab>
                                    :<p>未承認案件</p>
                                }
                            </a>
                        </Link>
                        <Link href="/route-tmpl">
                            <a>
                                {currentPathname.match('route-tmpl*') ? 
                                    <CurrentTab>ルート作成</CurrentTab>
                                    :<p>ルート作成</p>
                                }
                            </a>
                        </Link>
                        <Link href="/unreached">
                            <a>
                                {currentPathname.match('unreached*') ? 
                                    <CurrentTab>未着案件</CurrentTab>
                                    :<p>未着案件</p>
                                }
                            </a>
                        </Link>
                        <Link href="/agent">
                            <a>
                                {currentPathname.match('agent*') ? 
                                    <CurrentTab>代理設定</CurrentTab>
                                    :<p>代理設定</p>
                                }
                            </a>
                        </Link>
                    </span>
                :''}
                <a onClick={logout}><p>ログアウト</p></a>
            </NavBox>
        </Flex>
    )
}

const mediaMobile = mediaQuery.lessThan("medium");

const Flex = styled.div`
    ${mediaMobile `
    display: none;
    `}
    flex: 2;
    background: gainsboro;
`;

const NavBox = styled.div`
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

const CurrentTab = styled.p`
    background: #1e90ff;
`;

export default LeftNav