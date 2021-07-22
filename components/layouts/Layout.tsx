import {useEffect,useState} from 'react';
import styles from '../../styles/Home.module.css';
import Nav from './Nav';
import LeftNav from './LeftNav';
import styled from 'styled-components'
import {useAuth} from '../../hooks/useAuth'
import {useRouter} from 'next/router'
import { userInfo } from 'os';
import {useGlobal} from '../../hooks/useGlobal';



export const Layout = ({children}) => {
    const {logout, me, user}  = useAuth();
    const router = useRouter()
    const [asynced, setAsynced] = useState<boolean>(false)

    useEffect(() => {
        const initialAction = async() => {
            await me()
            setAsynced(true)
        }
        initialAction()
    }, [router])

    return (
        <>
            {asynced && 
                <span>
                    <Nav/>
                    <FlexDiv>
                        {user?.message === undefined &&
                        <LeftNav/>
                        }
                        <Container>
                            {children}
                        </Container>
                    </FlexDiv>
                </span>
            }
        </>
    )
}

const FlexDiv = styled.div`
    display: flex;
    height: 100vh;
`;

const Container = styled.div`
    width: 80%;
    margin: 40px auto;
    padding: 0 20px;
`;


export default Layout