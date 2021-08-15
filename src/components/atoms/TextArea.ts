import React from 'react';
import styled from 'styled-components';

interface Props {
  editable?: boolean;
}

const TextArea = styled.textarea<Props>`
  width: 100%;
  height: 300px;
  ${(props) =>
    !props.editable &&
    `
    pointer-events : none;
    `}
`;

TextArea.defaultProps = {
  editable: true,
};

export default TextArea;
