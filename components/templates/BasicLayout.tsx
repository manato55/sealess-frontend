import React,{Dispatch, SetStateAction} from 'react'
import Header from '../molecules/Header'
import LeftNav from '../molecules/LeftNav'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import { isNavToggle, userStatus } from '../../store/atom'


interface Props {
    children: React.ReactNode;
    isNav?: boolean;
}


export const BasicLayout = (props: Props) => {
    const [isNav, setIsNav] = useRecoilState(isNavToggle)
    const [user, setUser] = useRecoilState(userStatus)

    return (
        <>
            <Header />
            <ContentWrapper>
                {user?.id &&
                    <NavWrapper isNav={isNav}>
                        <LeftNav />
                    </NavWrapper>
                }
                <BodyWrapper>
                    {props.children}
                </BodyWrapper>
            </ContentWrapper>
        </>
    )
}


const ContentWrapper = styled.div`
    display: flex;
`;

const NavWrapper = styled.div<Props>`
    flex: 2;
    ${(props) => !props.isNav && `
    display: none;
    `}
    background: gainsboro;
`;

const BodyWrapper = styled.div`
    flex: 8;
    margin: 20px;
`;

export default BasicLayout