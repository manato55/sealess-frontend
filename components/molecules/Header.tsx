import React from 'react'
import Logo from '../atoms/Logo'
import ButtonToggle from '../organisms/ButtonToggle'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { userStatus } from '../../store/atom'

interface Props {
    
}

export const Header = (props: Props) => {
    const user = useRecoilValue(userStatus)

    return (
        <>
            <StyledHeader>
                {user?.id && 
                <ButtonToggle />
                }
                <Logo />
            </StyledHeader>
        </>
    )
}


const StyledHeader = styled.header`
    height: 60px;
    width: 100%;
    background: #1e90ff;
    display: flex;
`;


export default Header