import {useState,useEffect,useCallback,useRef} from 'react'
import {useDraft} from '../../hooks/useDraft'
import {useFiscalYear} from '../../hooks/useSWRFunc'
import Button from '../../components/layouts/Button'
import ErrorMsg from '../../components/layouts/ErrorMsg'
import TableContainer from '../../components/layouts/TableContainer';
import Table from '../../components/layouts/Table';
import Link from 'next/link';
import { toDateWeek } from '../../lib/dateHelper';
import Paginate from '../../components/layouts/Paginate'
import { useRouter } from 'next/router';
import styled from 'styled-components'

type Data = {
    task: string;
    name: string;
    year: number;
}

export const Search = (): React.ReactElement => {
    const [task, setTask] = useState<string>('')
    const [name, setName] = useState<string>('')
    const router = useRouter();
    const {searchTask, searchedTask, inputError, clearInputError} = useDraft();
    const [selectedJapYear, setSelectedJapYear] = useState<number>();
    let offset = router.query.page
        ? Number.parseInt(String(router.query.page), 10)
        : 0;
    const taskPerPage: number = 3
    const taskRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const yearRef = useRef<HTMLSelectElement>(null)
    const {isError, fiscalYear} = useFiscalYear();

    // ページリロード時の対応(アンマウントではないのでローカルストレージの情報は削除されない)
    useEffect(() => {
        if(localStorage['data'] !== undefined) {
            const data: Data = JSON.parse(localStorage['data'])
            searchTask(data,offset)
            taskRef.current.value = data.task
            nameRef.current.value = data.name
            setTask(data.task)
            setName(data.name)
            setSelectedJapYear(data.year)
            if(data.year !== undefined) {
                const yearAction = async() => {
                    if(yearRef.current !== null) {
                        yearRef.current.value = String(data.year)
                    }
                }
                yearAction();
            }
        }
        return () => {
            clearInputError()
        }
    }, [])

    const submitSearch = () => {
        // ページ途中で検索を実行した場合に１ページ目に戻す
        router.push('/search/1'); 
        let offset = 1
        const data: Data = {
            task: task,
            name: name,
            year: selectedJapYear,
        }
        searchTask(data,offset)
        localStorage['data'] = JSON.stringify(data)
    }

    const handleChangePage = useCallback(async(_: React.ChangeEvent<unknown>, page: number) => {
        const data: Data = JSON.parse(localStorage['data'])
        await searchTask(data,page)
        router.push(`/search/${page}`);  
    },[]);

    return (
        <>
            <ErrorMsg color={'red'}>{inputError !== undefined && inputError}</ErrorMsg>
            <p>案件名</p>
            <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask(e.target.value)}
                ref={taskRef}
            />
            <p>担当者名</p>
            <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                ref={nameRef}
            />
            <p>年度</p>
            <select 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedJapYear(Number(e.target.value))} 
                defaultValue={'choice'}
                ref={yearRef} 
            >
                <option value="choice" disabled>選択してください</option>
                {fiscalYear?.map((year, index) => 
                    <option key={index} value={year}>令和{year}年度</option>
                )}
            </select>
            <Button
                background="aqua"
                onClick={() => submitSearch()}
            >
                検索
            </Button>
            {searchedTask !== undefined &&
                <div>
                    {searchedTask[0].length > 0 ?
                        <TableContainer>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>案件名</th>
                                        <th>担当者</th>
                                        <th>完了日時</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedTask[0]?.map((task,index) => 
                                        <tr key={index}>
                                            <td>
                                                <Link href="/history/[id]" as={`/history/${task.id}`} passHref>
                                                    <A>{task.title}</A>
                                                </Link>
                                            </td>
                                            <td>{task.user.name}</td>
                                            <td>{toDateWeek(task.updated_at)}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <Paginate
                                contents={searchedTask[1]}
                                perPage={taskPerPage}
                                offset={offset}
                                change={handleChangePage}
                            />
                        </TableContainer>
                    : '該当なし'}
                </div>
            }
        </>
    )
}

const A = styled.a`
    color: red;
`;

export default Search
