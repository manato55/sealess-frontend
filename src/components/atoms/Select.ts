import styled from 'styled-components';

interface Props {
  width?: number;
}

const Select = styled.select<Props>`
  width: ${(props) => props.width}%;
`;

Select.defaultProps = {
  width: 80,
};

export default Select;
