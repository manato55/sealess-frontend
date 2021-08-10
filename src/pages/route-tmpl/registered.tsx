import {useEffect, useState, useRef} from 'react'
import {useRoute} from '../../hooks/useRoute'
import {useGlobal} from '../../hooks/useGlobal';
import styled from 'styled-components'


export const Registered = (): React.ReactElement => {
    const {fetchRegisteredRoute, registeredRoute, removeRegisteredRoute} = useRoute()
    const {updateLoading, asyncLoading} = useGlobal();
    const [selectedRoute, setSelectedRoute] = useState<{id:number}>()
    const loopCnt: number = 5;
    const routeRef = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        const initialAction = async() => {
            await fetchRegisteredRoute()
            updateLoading()
        }
        initialAction()
    },[])

    const labelChoice = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const routeTmp: {id:number} = registeredRoute.find(route => route.id === Number(e.target.value))
        setSelectedRoute(routeTmp)
    }

    async function removeThisRoute(): Promise<void> {
        if(!confirm('削除しますか？')) {
            return;
        }
        await removeRegisteredRoute(selectedRoute.id)
        fetchRegisteredRoute()
        setSelectedRoute(undefined)
        routeRef.current.value = 'choice'
    }

    return (
        <>
            <Container>
                <select onChange={(e) => labelChoice(e)} defaultValue={'choice'} ref={routeRef}>
                    <option value="choice" disabled>選択してください</option>
                    {registeredRoute !== undefined && registeredRoute.map((route,index) => 
                        <option key={index} value={route.id}>{route.label}</option>
                    )}
                </select>
                <br />
                {[...Array(loopCnt)].map((_, i) => 
                    selectedRoute !== undefined && selectedRoute[`route${i}_user`] != null &&
                    <RouteContainer key={i}>
                        <PplInvolved>
                            <p>関与者{i}</p>
                            <p>{selectedRoute[`route${i}_user`].department}&emsp;{selectedRoute[`route${i}_user`].section}&emsp;{selectedRoute[`route${i}_user`].name}</p>
                        </PplInvolved>
                        <ArrowBox>
                            {selectedRoute[`route${i+1}`] != null && 
                            <span>↓</span>
                            }
                        </ArrowBox>
                    </RouteContainer>
                )}
                {selectedRoute !== undefined && 
                    <DeleteBtn onClick={() => removeThisRoute()}>このルートを削除</DeleteBtn>
                }
            </Container>
        </>
    )
}

const ArrowBox = styled.div`
    margin-top: 15px;
`;

const DeleteBtn = styled.span`
    text-decoration: underline;
    color: blue;
    cursor: pointer;
`;

const Container = styled.div`
    max-width: 600px;
    margin: 30px auto;
    padding: 30px;
    border-radius: 10px;
`;

const RouteContainer = styled.div`
    text-align: center;
    margin: 20px;
`;

const PplInvolved = styled.div`
    border-radius: 10px;
    background: gainsboro;
    padding: 20px;
`;


export default Registered