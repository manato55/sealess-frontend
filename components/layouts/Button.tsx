import styled, {css} from 'styled-components'



interface Props {
    background?: string
}

const Button = styled.button<Props>`
    margin: 40px 0;
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
              background-color: ${(props) => props.theme.palette.lightGray.main};
              color: ${(props) => props.theme.palette.lightGray.contrastText};
            `;
        }
      }}
`;

Button.defaultProps = {
    background: 'dark',
  };


export default Button