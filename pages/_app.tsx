import { useState, useEffect } from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../hooks/useAuth';
import { DraftProvider } from '../hooks/useDraft';
import { GlobalProvider } from '../hooks/useGlobal';
import { ReturnedProvider } from '../hooks/useReturned';
import { RouteProvider } from '../hooks/useRoute';
import { useGlobal } from '../hooks/useGlobal';
import { ProgressProvider } from '../hooks/useProgress';
import { CompletedProvider } from '../hooks/useCompleted';
import Layout from '../components/layouts/Layout';
import Loading from '../components/layouts/Loading';
import {useRouter} from 'next/router'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import axios from '../axios'
import AuthCheck from '../components/AuthCheck'


function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RecoilRoot>
      <AuthCheck>
        <GlobalProvider>
          <DraftProvider>
            <RouteProvider>
              <CompletedProvider>
                <ReturnedProvider>
                  <ProgressProvider>
                    <AuthProvider>
                      <Layout>
                        <ToastContainer />
                          <Component {...pageProps}/>
                      </Layout>
                    </AuthProvider>
                  </ProgressProvider>
                </ReturnedProvider>
              </CompletedProvider>
            </RouteProvider>
          </DraftProvider>
        </GlobalProvider>
      </AuthCheck>
    </RecoilRoot>
  )
}


export default MyApp
