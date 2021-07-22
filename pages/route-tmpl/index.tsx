import {useState,useEffect} from 'react'
import Routing from '../../components/draft/Routing'
import {useRoute} from '../../hooks/useRoute'
import styled from 'styled-components'
import Link from 'next/link';


export const RouteTmpl = (): React.ReactElement => {
    const [pplInRoute, setPplInRoute] = useState([])
    const {registerRoute, validationError,clearValidationMessage} = useRoute()
    const [routeLabel, setRouteLabel] = useState<string>('')

    useEffect(() => {
        return () => {
            clearValidationMessage()
        };
    }, []);

    const register = (): void => {
        if(pplInRoute.length === 0) {
            alert('未設定です。')
            return;
        }
        if(!confirm('登録しますか？')) {
            return;
        }
        registerRoute(pplInRoute, routeLabel)
    }

    return (
        <>
            <LinkContainer>
                <Link href="/route-tmpl/registered">
                    <a><Span>登録済み画面へ</Span></a>
                </Link>
            </LinkContainer>
            <ErrorMessage>{validationError}</ErrorMessage>
            <p>登録名</p>
            <RegisterInput
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteLabel(e.target.value)}
            />
            <br />
            <Routing
                setPplInRoute={setPplInRoute}
                pplInRoute={pplInRoute}
                process={false}
                isRegisteredRoute={false}
            />
            <button onClick={() => register()}>登録</button>
        </>
    )
}


const RegisterInput = styled.input`
    width: 80%;
`;

const ErrorMessage = styled.p`
    color: red;
`;

const LinkContainer = styled.div`
    text-align: right;
`;

const Span = styled.span`
    text-decoration: underline;
    color: blue;
`;


export default  RouteTmpl