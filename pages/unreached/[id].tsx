import { useRecoilValue } from 'recoil'
import {useState, useEffect} from 'react'
import {useDraft} from '../../hooks/useDraft'
import {useGlobal} from '../../hooks/useGlobal'
import Loading from '../../components/layouts/Loading';
import BasicInfoInProgress from '../../components/progress/BasicInfoInProgress'
import AdditiveInProgress from '../../components/progress/AdditiveInProgress'
import RouteInProgress from '../../components/progress/RouteInProgress'
import SwitchTab from '../../components/layouts/SwitchTab'
import styled from 'styled-components'
import {useRouter} from 'next/router'



export const UnreachedTaskDetail = (): React.ReactElement => {
    const router = useRouter();
    const [paramsId, setParamsId] = useState<number>()
    const {updateLoading, asyncLoading} = useGlobal();
    const {fetchSelectedUnreachedTask, selectedUnreachedTask} = useDraft();
    const [currComponent, setCurrComponent] = useState<string>('basic')

    useEffect(() => {
        // idがqueryで利用可能になったら処理される
        if (router.asPath !== router.route) {
            setParamsId(Number(router.query.id));
        }
    }, [router]);

    useEffect(() => {
        if(paramsId) {
            const getTask = async () => {
                await fetchSelectedUnreachedTask(paramsId)
                updateLoading()
            }
            getTask()
        }
    }, [paramsId]);

    return (
        <>
            {asyncLoading === true ?
                // URL直打ちで別のパラメータを入力してきた場合の対策
                selectedUnreachedTask.length !== 0?
                    <div>
                        <SwitchTab 
                            currComponent={currComponent}
                            setCurrComponent={setCurrComponent}
                            isComment={false}
                        />
                        {currComponent === 'basic' ? 
                            <BasicInfoInProgress 
                                title={selectedUnreachedTask[0].title}
                                contents={selectedUnreachedTask[0].content}    
                            />:
                        currComponent === 'additive' ?
                            <AdditiveInProgress 
                                filename={selectedUnreachedTask[0].filename}
                                taskId={paramsId}
                            />:
                            <RouteInProgress
                                taskRoute={selectedUnreachedTask}
                                completed={false}
                            />
                        }<br/>
                    </div>
                :''
            :
                <Loading/>
            }
        </>
    )
}




export default UnreachedTaskDetail