import { useState, useEffect, useCallback, useRef } from 'react';
import { useDraft } from '../../hooks/useDraft';
import { useFiscalYear } from '../../hooks/useSWRFunc';
import Button from '../../components/atoms/Button';
import ErrorMessageWrapper from '../../components/atoms/ErrorMessageWrapper';
import Paginate from '../../components/molecules/Paginate';
import { useRouter } from 'next/router';
import TableContents from '../../components/molecules/TableContents';
import SearchFunction from '../../components/organisms/SearchFunction';
import { useRecoilState } from 'recoil';
import { authErrorMessage } from '../../store/atom';

type Data = {
  task: string;
  name: string;
  year: number;
};

type Task = {
  id: number;
  title: string;
  user: {
    name: string;
  };
  updated_at: string;
}[];

export const Search = (): React.ReactElement => {
  const [task, setTask] = useState<string>('');
  const [name, setName] = useState<string>('');
  const router = useRouter();
  const { searchTask } = useDraft();
  const [selectedJapYear, setSelectedJapYear] = useState<number>();
  let offset = router.query.page ? Number.parseInt(String(router.query.page), 10) : 0;
  const taskPerPage: number = 3;
  const taskRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);
  const { isError, fiscalYear } = useFiscalYear();
  const [searchedTask, setSearchedTask] = useState<Task[]>();
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);

  // ページリロード時の対応
  useEffect(() => {
    if (localStorage['data'] !== undefined) {
      const data: Data = JSON.parse(localStorage['data']);
      const reSearch = async () => {
        const res = await searchTask(data, offset);
        setSearchedTask(res);
      };
      reSearch();
      taskRef.current.value = data.task;
      nameRef.current.value = data.name;
      setTask(data.task);
      setName(data.name);
      setSelectedJapYear(data.year);
      if (data.year !== undefined) {
        const yearAction = () => {
          if (yearRef.current !== null) {
            yearRef.current.value = String(data.year);
          }
        };
        yearAction();
      }
    }
    return () => {
      setErrorMessage({ ...errorMessage, general: false });
    };
  }, []);

  const submitSearch = async () => {
    // ページ途中で検索を実行した場合に１ページ目に戻す
    router.push('/search/1');
    let offset = 1;
    const data: Data = {
      task: task,
      name: name,
      year: selectedJapYear,
    };
    const res = await searchTask(data, offset);
    setSearchedTask(res);
    localStorage['data'] = JSON.stringify(data);
  };

  const handleChangePage = useCallback(async (_: React.ChangeEvent<unknown>, page: number) => {
    const data: Data = JSON.parse(localStorage['data']);
    await searchTask(data, page);
    router.push(`/search/${page}`);
  }, []);

  return (
    <>
      <SearchFunction
        setTask={setTask}
        setName={setName}
        setSelectedJapYear={setSelectedJapYear}
        fiscalYear={fiscalYear}
        yearRef={yearRef}
        taskRef={taskRef}
        nameRef={nameRef}
      />
      <Button marginTop={20} onClick={() => submitSearch()}>
        検索
      </Button>
      {searchedTask !== undefined && (
        <div>
          {searchedTask[0].length > 0 ? (
            <div>
              <TableContents tasks={searchedTask[0]} th={['案件名', '担当者', '完了日時']} pathName={'history'} />
              <Paginate contents={searchedTask[1]} perPage={taskPerPage} offset={offset} change={handleChangePage} />
            </div>
          ) : (
            <ErrorMessageWrapper>該当なし</ErrorMessageWrapper>
          )}
        </div>
      )}
    </>
  );
};

export default Search;
