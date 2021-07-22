import styled from 'styled-components'


type commentProps = {
    comment: string;
}

export const BasicInfo = (props: commentProps): React.ReactElement => {    
    
    return (
        <>
            <TextArea>
                {props.comment}
            </TextArea>
            
        </>
    )
}

const TextArea = styled.p`
    width: 90%;
    height: 300px;
    border: 1px solid black;
    padding: 10px;
`;

export default BasicInfo