import {useState, useEffect} from 'react'
import {useDraft} from '../../hooks/useDraft'
import {useGlobal} from '../../hooks/useGlobal'
import Loading from '../../components/atoms/Loading';
import BasicInfo from '../../components/molecules/BasicInfo'
import AdditiveInProgress from '../../components/organisms/AdditiveInProgress'
import RouteInProgress from '../../components/organisms/RouteInProgress'
import {useRouter} from 'next/router'
import LabelChoice from '../../components/molecules/LabelChoice';


export const UnreachedTaskDetail = (): React.ReactElement => {
    const router = useRouter();
    const [paramsId, setParamsId] = useState<number>(Number(router.query.id))
    const {updateLoading, asyncLoading} = useGlobal();
    const {fetchSelectedUnreachedTask, selectedUnreachedTask} = useDraft();
    const [currComponent, setCurrComponent] = useState<string>('basic')

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
                selectedUnreachedTask.length > 0 &&
                    <div>
                        <LabelChoice 
                            currComponent={currComponent}
                            setCurrComponent={setCurrComponent}
                            isComment={false}
                        />
                        {currComponent === 'basic' ? 
                            <BasicInfo
                                title={selectedUnreachedTask[0].title}
                                contents={selectedUnreachedTask[0].content}  
                                editable={false}  
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
            :
                <Loading/>
            }
        </>
    )
}




export default UnreachedTaskDetail