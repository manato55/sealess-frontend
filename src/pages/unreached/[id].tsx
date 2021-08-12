import {useState, useEffect} from 'react'
import {useDraft} from '../../hooks/useDraft'
import Loading from '../../components/atoms/Loading';
import BasicInfo from '../../components/molecules/BasicInfo'
import AdditiveInProgress from '../../components/organisms/AdditiveInProgress'
import RouteInProgress from '../../components/organisms/RouteInProgress'
import {useRouter} from 'next/router'
import LabelChoice from '../../components/molecules/LabelChoice';



type SelectedUnreached = {
    title: string;
    content: string;
    filename: string;
}

export const UnreachedTaskDetail = (): React.ReactElement => {
    const router = useRouter();
    const [paramsId, setParamsId] = useState<number>(Number(router.query.id))
    const {fetchSelectedUnreachedTask} = useDraft();
    const [currComponent, setCurrComponent] = useState<string>('basic')
    const [selectedUnreachedTask, setSelectedUnreachedTask] = useState<SelectedUnreached[]>()

    useEffect(() => {
        const getTask = async () => {
            const res = await fetchSelectedUnreachedTask(paramsId)
            setSelectedUnreachedTask(res)
        }
        getTask()
    }, [paramsId]);

    
    return (
        <>
            {selectedUnreachedTask ?
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