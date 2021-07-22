import React, { useEffect, useState } from 'react'
import {useProgress} from '../../hooks/useProgress'
import Common from '../../styles/Common.module.scss'
import styled from 'styled-components'

type basicProps = {
    taskRoute: any;
    completed?: boolean;
}

export const RouteInProgress = (props: basicProps): React.ReactElement => {
    const [pplInRoute, setPplInRoute] = useState<string[]>([]);


    useEffect(() => {
        if(props.taskRoute.length > 0) {
            let keys: string[] = Object.keys(props.taskRoute[0])
            let routeExtracted: string[] = keys.filter(v => v.match(/route[1-5]_user/))
            setPplInRoute(routeExtracted)
        }
    }, [props.taskRoute])


    return (
        <div className={Common.input_container}>
            {pplInRoute.length > 0 ? pplInRoute.map((routeNum, index) => 
                <div className={Common.route_container} key={index}>
                    {props.taskRoute[0][routeNum] !== null && 
                        <div>
                            {index !== 0 && <p>↓</p>}
                            <div className={Common.ppl_involved}>
                                <p>
                                    <Involved>関与者{index+1}</Involved>
                                    {!props.completed && routeNum.slice(0,6) === props.taskRoute[0].process && 
                                        <Holder>案件保持</Holder>
                                    }
                                </p>
                                {props.taskRoute[0][routeNum].department}&emsp;{props.taskRoute[0][routeNum].section}&emsp;{props.taskRoute[0][routeNum].name}
                            </div>
                        </div>
                        
                    }
                </div>
            ):''}
        </div>
    )
}

const Involved = styled.span`
    margin-right: 20px;
`;

const Holder = styled.span`
    color: red;
`;


export default RouteInProgress