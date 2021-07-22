import styled from 'styled-components'


interface Props {

}


const TableContainer = styled.div<Props>`
    text-align: center;

    table {
        display: block;
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
        text-align: center;
        table-layout: fixed;
        width: 100%;
        margin-top: 40px;
    }
    
    table tr, table td {
        white-space: nowrap;
        width: 10%;
    }
`;


export default TableContainer