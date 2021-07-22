import {useEffect, useState, useRef} from 'react'
import {useRoute} from '../../hooks/useRoute'
import {useGlobal} from '../../hooks/useGlobal';
import Common from '../../styles/Common.module.scss'
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
            <div className={Common.input_container}>
                <select onChange={(e) => labelChoice(e)} defaultValue={'choice'} ref={routeRef}>
                    <option value="choice" disabled>選択してください</option>
                    {registeredRoute !== undefined && registeredRoute.map((route,index) => 
                        <option key={index} value={route.id}>{route.label}</option>
                    )}
                </select>
                <br />
                {[...Array(loopCnt)].map((_, i) => 
                    selectedRoute !== undefined && selectedRoute[`route${i}_user`] != null &&
                    <div key={i} className={Common.route_container}>
                        <div className={`${Common.ppl_involved} ${Common.registered_route_box}`}>
                            <p>関与者{i}</p>
                            <p>{selectedRoute[`route${i}_user`].department}&emsp;{selectedRoute[`route${i}_user`].section}&emsp;{selectedRoute[`route${i}_user`].name}</p>
                        </div>
                        <ArrowBox>
                            {selectedRoute[`route${i+1}`] != null && 
                            <span>↓</span>
                            }
                        </ArrowBox>
                    </div>
                )}
                {selectedRoute !== undefined && 
                    <DeleteBtn onClick={() => removeThisRoute()}>このルートを削除</DeleteBtn>
                }
            </div>
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


export default Registered
