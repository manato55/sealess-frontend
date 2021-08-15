import styled from 'styled-components';

interface Props {
  visible?: boolean;
  editable?: boolean;
  marginTop?: number;
}

const Input = styled.input<Props>`
  ${(props) =>
    props.visible
      ? `
    visibility: hidden;
  `
      : `
    height: 40px;
    padding: 10px;
    display: inline-block;
    width: 100%;
  `}
  ${(props) =>
    !props.editable &&
    `
    pointer-events : none;
  `}
  margin-top: ${(props) => props.marginTop}px;
`;

Input.defaultProps = {
  editable: true,
  visible: false,
};

export default Input;
