import React, {useState,Dispatch,SetStateAction} from 'react'
import styled from 'styled-components'

type TabProps = {
    currComponent: string;
    isComment: boolean;
    setCurrComponent: Dispatch<SetStateAction<string>>;
}

export const SwitchTab = (props: TabProps) => {


    const changeTab = (e: React.MouseEvent<HTMLSpanElement,MouseEvent>):void => {
        let clicked: string = e.currentTarget.innerHTML
        if(clicked === '基本情報') {
            props.setCurrComponent('basic')
        } else if(clicked === '添付書類') {
            props.setCurrComponent('additive')
        } else if(clicked === 'ルート') {
            props.setCurrComponent('route')
        } else {
            props.setCurrComponent('comment')
        }
    }

    return (
        <>
            <SwitchTabContainer>
                <Switch><Basic currComponent={props.currComponent} onClick={(e) => changeTab(e)}>基本情報</Basic></Switch>
                <Switch><Adds currComponent={props.currComponent} onClick={(e) => changeTab(e)}>添付書類</Adds></Switch>
                <Switch><Rou currComponent={props.currComponent} onClick={(e) => changeTab(e)}>ルート</Rou></Switch>
                {props.isComment &&
                    <Switch><Comment currComponent={props.currComponent} onClick={(e) => changeTab(e)}>返却コメント</Comment></Switch>
                }
            </SwitchTabContainer>   
        </>
    )
}


const SwitchTabContainer = styled.div`
    margin-bottom: 40px;
`;

const Switch = styled.span`
    margin-right: 20px;
    cursor: pointer;
`;

const Basic = styled.span<any>`
    color: ${({currComponent}) => (currComponent === 'basic'? 'red' : '')};
`;

const Adds = styled.span<any>`
    color: ${({currComponent}) => (currComponent === 'additive'? 'red' : '')};
`;

const Rou = styled.span<any>`
    color: ${({currComponent}) => (currComponent === 'route'? 'red' : '')};
`;

const Comment = styled.span<any>`
    color: ${({currComponent}) => (currComponent === 'comment'? 'red' : '')};
`;

export default SwitchTab