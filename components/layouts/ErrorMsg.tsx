import styled from 'styled-components'



interface Props {
    color?: string
}

const ErrorMsg = styled.p<Props>`
    color: ${props => props.color ? props.color:'blue'};
`;


export default ErrorMsg