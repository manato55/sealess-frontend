import repository from '../axios/repository'
import { useSetRecoilState, useRecoilState } from 'recoil'
import { http, authErrorMessage, eachErrorFlag } from '../store/atom'
import {useRouter} from 'next/router'
import useSWR from 'swr';
import { toast } from 'react-toastify'



export const useRouting = () => {
    const setHttpStatus = useSetRecoilState(http);
    const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage)
    const [errorFlag, setErrorFlag] = useRecoilState(eachErrorFlag)

    const { data, error } = useSWR('route/fetch-agent-status', fetchAgentSetting);

    return {
        agentStatus: data ? data : null,
        isLoading: !error && !data,
        isError: error,


        registerRoute: async(route, label) => {
            setErrorMessage({...errorMessage, label: false})
            const res = await repository.post('route/register-route', {
                data: {
                    route: route,
                    label: label,
                }
            }).catch(error => error.response); 
            if(res.status === 422) {
                setErrorMessage({...errorMessage, label: res.data.error["data.label"]})
            } else if(res.status === 200) {
                toast.success('登録しました。')
            } else {
                setHttpStatus(res.status)
            }
        },

        fetchRegisteredRoute: async() => {
            const res = await repository.get('route/fetch-registered').catch(error => error.response); 
            if(res.status === 200) {
                return res.data
            } else {
                setHttpStatus(res.status)
            }
        },

        removeRegisteredRoute: async(id) => {
            const res = await repository.post('route/remove-registered-route', {id:id}).catch(error => error.response); 
            if(res.status === 200) {
                toast.success('削除しました。')
                return true
            } else {
                setHttpStatus(res.status)
            }
        },

        registerAgentUser: async(userId) => {
            const res = await repository.post('route/agent-setting', {id:userId}).catch(error => error.response); 
            if(res.status !== 200) {
                setHttpStatus(res.status)
            }
        },

        agentStatus2False: async() => {
            const res = await repository.post('route/agent-status-2false').catch(error => error.response); 
            if(res.status !== 200) {
                setHttpStatus(res.status)
            }
        },
    
        agentStatus2True: async() => {
            const res = await repository.post('route/agent-status-2true').catch(error => error.response); 
            if(res.status !== 200) {
                setHttpStatus(res.status)
            }
        },
    };
}

async function fetchAgentSetting(path) {
    const res = await repository.get(path).catch(error => error.response); 
    return res.data
}