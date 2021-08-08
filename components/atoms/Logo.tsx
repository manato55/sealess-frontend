import styled from 'styled-components';
import React from 'react';
import Link from 'next/link';


const Logo = () => {
    return (
        <StyledLogo>
            <Link href="/">
                <a>app</a>
            </Link>
        </StyledLogo>
    )
}

const StyledLogo = styled.div`
    margin: auto 0;
    padding-right: 10px;
    font-size: 24px;
    text-align: right;
    flex: 1;
`;

export default React.memo(Logo)