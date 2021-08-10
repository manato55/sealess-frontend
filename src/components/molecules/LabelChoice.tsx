import React,{Dispatch,SetStateAction,useCallback} from 'react'
import SwitchLabel from '../atoms/SwitchLabel'
import styled from 'styled-components'

type Props = {
    currComponent?: string;
    isComment?: boolean;
    setCurrComponent?: Dispatch<SetStateAction<string>>;
    curr?: string;
}

export const LabelChoice = (props: Props): React.ReactElement => {

    const changeTab = useCallback((e: React.MouseEvent<HTMLSpanElement,MouseEvent>):void => {
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
    }, [props]);

    return (
        <>
            <SwitchTabContainer>
                <SwitchLabel>
                    <Basic onClick={(e) => changeTab(e)} curr={props.currComponent}>基本情報</Basic>
                </SwitchLabel>
                <SwitchLabel >
                    <Adds onClick={(e) => changeTab(e)} curr={props.currComponent}>添付書類</Adds>
                </SwitchLabel>
                <SwitchLabel>
                    <Route onClick={(e) => changeTab(e)} curr={props.currComponent}>ルート</Route>
                </SwitchLabel>
                {props.isComment &&
                    <SwitchLabel>
                        <Comment curr={props.currComponent} onClick={(e) => changeTab(e)}>返却コメント</Comment>
                    </SwitchLabel>
                }
            </SwitchTabContainer>
        </>
    )
}


const SwitchTabContainer = styled.div`
    margin-bottom: 40px;
`;

const Basic = styled.span<Props>`
    color: ${(props) => (props.curr === 'basic' && 'red')};
`;

const Adds = styled.span<Props>`
    color: ${(props) => (props.curr === 'additive' && 'red')};
`;

const Route = styled.span<Props>`
    color: ${(props) => (props.curr === 'route' && 'red')};
`;

const Comment = styled.span<Props>`
    color: ${(props) => (props.curr === 'comment' && 'red')};
`;

export default React.memo(LabelChoice)
