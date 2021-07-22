import styled from 'styled-components'



interface Props {
    background?: string
}

const Button = styled.button<Props>`
    margin: 40px 0;
    height: 50px;
    background-color: rgba(106, 154, 248, 0.697);
    // background-color: ${props => props.background === 'red'? 'blue': 'aqua'};
    font-size: large;
    width: 80%;
`;


export default Button