import React,{useEffect,} from 'react'
import { useSWRFunc } from '../../hooks/useSWRFunc';
import TableContents from '../../components/molecules/TableContents';


export const Receive = (): React.ReactElement => {
    const {isLoading,recievedTask} = useSWRFunc();

    return (
        <>
            {isLoading ? (<p>Loading...</p>
                ) : (
                recievedTask?.length > 0 ?
                    // <TableContainer>
                    //     <Table>
                    //         <thead>
                    //             <tr>
                    //                 <th>案件名</th>
                    //                 <th>起案者</th>
                    //                 <th>受信日時</th>
                    //             </tr>
                    //         </thead>
                    //         <tbody>
                    //             {recievedTask?.map((task,index) => 
                    //                 <tr key={index}>
                    //                     <td>
                    //                         <Link href={`/recieve/${task.id}`}>
                    //                             <a>{task.title}</a>
                    //                         </Link>
                    //                     </td>
                    //                     <td>{task.user.section}&emsp;{task.user.name}</td>
                    //                     <td>{toDateWeek(task.updated_at)}</td>
                    //                 </tr>
                    //             )}
                    //         </tbody>
                    //     </Table>
                    // </TableContainer>
                    <TableContents 
                        tasks={recievedTask}
                        th={['案件名','起案者','受信日時']}
                        pathName={'recieve'}
                    />
                :'案件はありません。'
            )}
        </>
    )
}

export default Receive