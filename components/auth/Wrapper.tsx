import styled from 'styled-components'


interface Props {
    background?: string
}


const AuthWrapper = styled.div<Props>`
    text-align: center;
    border: 0px black solid;
    width: 80%;
    margin: 100px auto;
    padding: 40px;
    border-radius: 10px;
    background-color: gainsboro;
`;


export default AuthWrapper