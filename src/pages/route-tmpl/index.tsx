import {useState,useEffect} from 'react'
import {useRouting} from '../../hooks/useRouting'
import Button from '../../components/atoms/Button'
import RouteRegister from '../../components/organisms/RouteRegister'


export const RouteTmpl = (): React.ReactElement => {
    const [pplInRoute, setPplInRoute] = useState([])
    const {registerRoute} = useRouting()
    const [routeLabel, setRouteLabel] = useState<string>('')
    

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
            <RouteRegister 
                pplInRoute={pplInRoute}
                setRouteLabel={setRouteLabel}
                setPplInRoute={setPplInRoute}
            />
            <Button 
                onClick={() => register()}
                marginTop={20}
            >
                登録
            </Button>
        </>
    )
}


export default  RouteTmpl