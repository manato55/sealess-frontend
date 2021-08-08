import styled from 'styled-components'
import Table from '../atoms/Table'

interface Props {
    children : React.ReactNode;
}


export const TableContainer = (props: Props) => {
    return (
        <>
            <Container>
                <Table>
                    {props.children}
                </Table>
            </Container>
        </>
    )
}


const Container = styled.div`
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