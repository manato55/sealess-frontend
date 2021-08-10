import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet as StyledComponentStyleSheets} from 'styled-components';
import styled from 'styled-components';
import { ServerStyleSheets as MuiStyleSheets } from '@material-ui/styles';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const styledComponentStyleSheets = new StyledComponentStyleSheets();
    const muiStyleSheets = new MuiStyleSheets();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            styledComponentStyleSheets.collectStyles(muiStyleSheets.collect(<App {...props} />)),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styledComponentStyleSheets.getStyleElement()}
            {muiStyleSheets.getStyleElement()}
          </>
        ),
      };
    } finally {
      styledComponentStyleSheets.seal();
    }
  }

  render() {
    return (
      <Html lang="ja">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Body>
          <Main />
          <NextScript />
        </Body>
      </Html>
    );
  }
}

const Body = styled.body`
  margin: 0;
`;

export default MyDocument;