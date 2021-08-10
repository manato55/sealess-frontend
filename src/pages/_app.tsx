import { useState, useEffect } from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../hooks/useAuth';
import { DraftProvider } from '../hooks/useDraft';
import { GlobalProvider } from '../hooks/useGlobal';
import { ReturnedProvider } from '../hooks/useReturned';
import { RouteProvider } from '../hooks/useRoute';
import { ProgressProvider } from '../hooks/useProgress';
import { CompletedProvider } from '../hooks/useCompleted';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import axios from '../axios'
import AuthCheck from '../components/templates/AuthCheck'
import theme from '../styles/theme';
import { ThemeProvider } from 'styled-components';
import BasicLayout from '../components/templates/BasicLayout'




function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <AuthCheck>
          <GlobalProvider>
            <DraftProvider>
              <RouteProvider>
                <CompletedProvider>
                  <ReturnedProvider>
                    <ProgressProvider>
                      <AuthProvider>
                        <BasicLayout>
                          <ToastContainer />
                            <Component {...pageProps}/>
                        </BasicLayout>
                      </AuthProvider>
                    </ProgressProvider>
                  </ReturnedProvider>
                </CompletedProvider>
              </RouteProvider>
            </DraftProvider>
          </GlobalProvider>
        </AuthCheck>
      </ThemeProvider>
    </RecoilRoot>
  )
}


export default MyApp
