import styled from 'styled-components'


interface Props {

}


const Table = styled.table<Props>`
    border-collapse:collapse;

    tr {
        height: 40px;
    }

    th {
        background-color: gainsboro;
    }

    tr:nth-child(2n+1) {
        background-color: white;
    }
    
    tr:nth-child(2n) {
        background-color:#c4ebff;
    }
    
    tr td {
        border: 1px solid #C0C0C0;
    }
`;


export default Table