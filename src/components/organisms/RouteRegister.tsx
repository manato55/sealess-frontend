import React, {Dispatch, SetStateAction} from 'react'
import styled from 'styled-components'
import Link from 'next/link';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper'
import Input from '../atoms/Input'
import RouteSetting from '../../components/molecules/RouteSetting'

interface Props {
    validationError: string[];
    setRouteLabel: Dispatch<SetStateAction<string>>;
    setPplInRoute: Dispatch<SetStateAction<object>>;
    pplInRoute: object[];
}

export const RouteRegister = (props: Props): React.ReactElement => {
    return (
        <>
            <LinkContainer>
                <Link href="/route-tmpl/registered" passHref>
                    <A>登録済み画面へ</A>
                </Link>
            </LinkContainer>
            <ErrorMessageWrapper>{props.validationError}</ErrorMessageWrapper>
            <p>登録名</p>
            <Input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setRouteLabel(e.target.value)}
            />
            <br />
            <RouteSetting
                setPplInRoute={props.setPplInRoute}
                pplInRoute={props.pplInRoute}
                process={false}
                isRegisteredRoute={false}
                agentStatus={undefined}
            />
        </>
    )
}


const A = styled.a`
    text-decoration: underline;
    color: blue;
`;

const LinkContainer = styled.div`
    text-align: right;
`;

export default RouteRegister