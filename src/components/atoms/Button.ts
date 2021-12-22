import styled, { css } from 'styled-components';
// changes added

interface Props {
  background?: string;
  marginTop?: number;
}

const Button = styled.button<Props>`
  margin-top: ${(props) => props.marginTop}px;
  height: 50px;
  font-size: large;
  width: 100%;
  ${(props) => {
    switch (props.background) {
      case 'dark':
        return css`
          background-color: ${(props) => props.theme.palette.black.main};
          color: ${(props) => props.theme.palette.black.contrastText};
        `;
      case 'light':
        return css`
          background-color: ${(props) => props.theme.palette.primary.main};
          color: ${(props) => props.theme.palette.primary.contrastText};
        `;
      case 'medium':
        return css`
          background-color: ${(props) => props.theme.palette.lightGray.main};
          color: ${(props) => props.theme.text.contrastText};
        `;
    }
  }}
`;

Button.defaultProps = {
  background: 'dark',
  marginTop: 40,
};

export default Button;
