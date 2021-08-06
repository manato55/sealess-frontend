import {useEffect,useState} from 'react';
import Nav from './Nav';
import LeftNav from './LeftNav';
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { http, userStatus } from '../../store/atom'
import Error from '../Error'

export const Layout = ({children}) => {
    const httpStatus = useRecoilValue(http)
    const user = useRecoilValue(userStatus)
    
    return (
        <>
            <Nav/>
            {httpStatus !== null ? 
                <Error errorCode={httpStatus}/>
            :
                <FlexDiv>
                    {user?.id &&
                    <LeftNav/>
                    }
                    <Container>
                        {children}
                    </Container>
                </FlexDiv>
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