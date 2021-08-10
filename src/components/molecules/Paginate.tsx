import React from 'react'
import { Pagination } from '@material-ui/lab';
import styled from 'styled-components';

interface Props {
    contents: object[];
    perPage: number;
    offset: number;
    change: (_: React.ChangeEvent<unknown>, page: number) => Promise<void>;
}

export const Paginate = (props: Props): React.ReactElement => {
    return (
        <>
            <PaginateWrapper>
                <Pagination
                    count={Math.ceil(props.contents?.length / props.perPage)}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    page={props.offset}
                    onChange={props.change}
                    size='small'
                />
            </PaginateWrapper>
        </>
    )
}

const PaginateWrapper = styled.div`
    text-align: center;
    margin-top: 50px;
`;

export default Paginate
