import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import AuthCheck from '../components/templates/AuthCheck';
import theme from '../styles/theme';
import { ThemeProvider } from 'styled-components';
import BasicLayout from '../components/templates/BasicLayout';
import ErrorHanding from '../components/templates/ErrorHanding';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <AuthCheck>
          <BasicLayout>
            <ErrorHanding>
              <ToastContainer />
              <Component {...pageProps} />
            </ErrorHanding>
          </BasicLayout>
        </AuthCheck>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default MyApp;
