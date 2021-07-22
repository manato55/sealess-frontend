import { useState, useEffect } from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../hooks/useAuth';
import { DraftProvider, useDraft } from '../hooks/useDraft';
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


function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()
  const {HttpStatusCode} = useGlobal();
  const {clearValidationMessage} = useDraft();
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<object>()


  useEffect(() => {
    const initialAction = async() => {
      const res = await axios.get('me').catch(error => error.response)
      if((!router.pathname.match('/login') && res.status === 401) && (!router.pathname.match('/register/*') && res.status === 401) && (!router.pathname.match('/password-issuance/*') && res.status === 401)) {
        window.location.href = '/login'      
        return 
      } else if(router.pathname === '/login' && res.status !== 401) {
        window.location.href = '/'
        return    
      }
      // admin以外がadmin,dep-adminページにアクセスしようとした場合
      if((router.pathname === '/admin' && res.data.user_type !== 0) || (router.pathname === '/dep-admin' && res.data.user_type !== 1)) {
        window.location.href = '/'
        return
      }
      // adminがadminページ以外にアクセスしようとした場合
      if(!router.pathname.match('/admin*') && res.data.user_type === 0) {
        window.location.href = '/admin'
        return
      }
      // dep-adminがdep-adminページ以外にアクセスしようとした場合
      if(!router.pathname.match('/dep-admin*') && res.data.user_type === 1) {
        window.location.href = '/dep-admin'
        return
      }
      setLoading(true)
    }
    initialAction()
  }, [])


  return (
    <RecoilRoot>
      <GlobalProvider>
        <DraftProvider>
          <RouteProvider>
            <CompletedProvider>
              <ReturnedProvider>
                <ProgressProvider>
                  <AuthProvider>
                    <Layout>
                      <ToastContainer />
                      {loading ? <Component {...pageProps}/>
                        : <Loading/>
                      }
                      {HttpStatusCode}
                    </Layout>
                  </AuthProvider>
                </ProgressProvider>
              </ReturnedProvider>
            </CompletedProvider>
          </RouteProvider>
        </DraftProvider>
      </GlobalProvider>
    </RecoilRoot>
  )
}


export default MyApp
