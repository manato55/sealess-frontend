import React, { useContext, useEffect, useState, createContext } from 'react';
import {useRouter} from 'next/router'
import axios from '../axios';
import { toast } from 'react-toastify'


type route = {
    id: number;
    label: string
}

type Agent = {
    is_enabled: boolean;
    agent_user: {
        department: string;
        section: string;
        name: string;
        id: string;
    }
}

type AgentOrString = Agent|string;


export const RouteContext = createContext({} as {
    registerRoute: (route: object[], label: string) => void;
    fetchRegisteredRoute: () => void;
    fetchAgentSetting: () => void;
    clearValidationMessage: () => void;
    removeRegisteredRoute: (id: number) => void;
    registerAgentUser: (id: number) => void;
    agentStatus2False: () => void;
    agentStatus2True: () => void;
    validationError: string[];
    registeredRoute: route[];
    agentStatus: AgentOrString;
});

export const useRoute = () => {
    return useContext(RouteContext);
};

export const RouteProvider = ({children}) => {
    const router = useRouter()
    const [agentStatus, setAgentStatus] = useState<AgentOrString>()
    const [validationError, setValidationError] = useState<string[]>()
    const [registeredRoute, setRegisteredRoute] = useState<route[]>()
    const clearValidationMessage = (): void => setValidationError([]);


    async function registerRoute(route, label): Promise<void> {
        setValidationError([])
        const res = await axios.post('route/register-route', {
            data: {
                route: route,
                label: label,
            }
        }).catch(error => error.response); 
        if(res.status === 422) {
            setValidationError(res.data.error["data.label"])
        } else {
            toast.success('登録しました。')
        }
    }

    async function fetchRegisteredRoute(): Promise<void> {
        const res = await axios.get('route/fetch-registered').catch(error => error.response); 
        if(res.status === 200) {
            setRegisteredRoute(res.data)
        }
    }

    async function removeRegisteredRoute(id): Promise<void> {
        const res = await axios.post('route/remove-registered-route', {id:id}).catch(error => error.response); 
        if(res.status === 200) {
            toast.success('削除しました。')
        }
    }

    async function registerAgentUser(userId): Promise<void> {
        const res = await axios.post('route/agent-setting', {id:userId}).catch(error => error.response); 
    }

    async function agentStatus2False(): Promise<void> {
        await axios.post('route/agent-status-2false').catch(error => error.response); 
    }

    async function agentStatus2True(): Promise<void> {
        const res = await axios.post('route/agent-status-2true').catch(error => error.response); 
        setAgentStatus(res.data)
    }

    async function fetchAgentSetting(): Promise<void> {
        const res = await axios.get('route/fetch-agent-status').catch(error => error.response); 
        if(res.status === 200) {
            setAgentStatus(res.data)
        } 
    }

    const value = {
        registerRoute,
        fetchRegisteredRoute,
        removeRegisteredRoute,
        clearValidationMessage,
        registerAgentUser,
        fetchAgentSetting,
        agentStatus2False,
        agentStatus2True,
        validationError,
        registeredRoute,
        agentStatus,
    }

    return <RouteContext.Provider value={value}>
                {children}
            </RouteContext.Provider>;
}

export default useRoute