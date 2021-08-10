import {useState,useEffect,useCallback,useRef} from 'react'
import {useDraft} from '../../hooks/useDraft'
import {useFiscalYear} from '../../hooks/useSWRFunc'
import Button from '../../components/atoms/Button'
import ErrorMessageWrapper from '../../components/atoms/ErrorMessageWrapper'
import Paginate from '../../components/molecules/Paginate'
import { useRouter } from 'next/router';
import TableContents from '../../components/molecules/TableContents';
import SearchFunction from '../../components/organisms/SearchFunction'


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
            <SearchFunction 
                inputError={inputError}
                setTask={setTask}
                setName={setName}
                setSelectedJapYear={setSelectedJapYear}
                fiscalYear={fiscalYear}
                yearRef={yearRef}
                taskRef={taskRef}
                nameRef={nameRef}
            />
            <Button
                marginTop={20}
                onClick={() => submitSearch()}
            >
                検索
            </Button>
            {searchedTask !== undefined &&
                <div>
                    {searchedTask[0].length > 0 ?
                        <div>
                            <TableContents 
                            tasks={searchedTask[0]}
                            th={['案件名','担当者','完了日時']}
                            pathName={'history'}
                            />
                            <Paginate
                                contents={searchedTask[1]}
                                perPage={taskPerPage}
                                offset={offset}
                                change={handleChangePage}
                            />
                        </div>
                    :
                        <ErrorMessageWrapper>該当なし</ErrorMessageWrapper>
                    }
                </div>
            }
        </>
    )
}


export default Search
