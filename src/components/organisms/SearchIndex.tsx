import { useState, useEffect } from 'react';
import { useDraft } from '../../hooks/useDraft';
import { useFiscalYear } from '../../hooks/useDraft';
import Button from '../atoms/Button';
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper';
import Paginate from '../molecules/Paginate';
import { useRouter } from 'next/router';
import TableContents from '../molecules/TableContents';
import SearchFunction from '../molecules/SearchFunction';
import { useRecoilValue } from 'recoil';
import { searchKeyword } from '../../store/atom';
import { authErrorMessage, http, eachErrorFlag } from '../../store/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';

type Task = {
  id: number;
  title: string;
  user: {
    name: string;
  };
  updated_at: string;
}[];

export const SearchIndex = (): React.ReactElement => {
  const router = useRouter();
  const { searchTask } = useDraft();
  let offset = router.query.page ? Number.parseInt(String(router.query.page), 10) : 0;
  const taskPerPage: number = 3;
  const { fiscalYear } = useFiscalYear();
  const [searchedTask, setSearchedTask] = useState<Task[]>();
  const keyword = useRecoilValue(searchKeyword);
  const setHttpStatus = useSetRecoilState(http);
  const [errorMessage, setErrorMessage] = useRecoilState(authErrorMessage);

  useEffect(() => {
    // ブラウザバックした際に、前回の検索状態を再表示する。
    const Props = ['task', 'name', 'year'];
    let cnt = 0;
    for (let i of Props) {
      if (keyword[i] === null) {
        cnt++;
      }
    }
    if (cnt === 3) {
      return;
    }

    const reSearch = async () => {
      const res = await searchTask(keyword, offset);
      setSearchedTask(res.value);
    };
    reSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitSearch = async () => {
    // ページ途中で検索を実行した場合に１ページ目に戻す
    router.push('/search/1');
    let offset = 1;
    setErrorMessage({ ...errorMessage, general: false });
    const res = await searchTask(keyword, offset);
    if (!res.isFailure) {
      setSearchedTask(res.value);
    } else {
      if (res.error.code === 422) {
        setErrorMessage({ ...errorMessage, general: res.error.message });
      } else {
        setHttpStatus(res.status);
      }
    }
  };

  const handleChangePage = async (_: React.ChangeEvent<unknown>, page: number) => {
    const res = await searchTask(keyword, page);
    setSearchedTask(res);
    router.push(`/search/${page}`);
  };

  return (
    <>
      <SearchFunction fiscalYear={fiscalYear} />
      <Button marginTop={20} onClick={() => submitSearch()}>
        検索
      </Button>
      {searchedTask && (
        <div>
          {searchedTask[0].length > 0 ? (
            <div>
              <TableContents
                tasks={searchedTask[0]}
                th={['案件名', '担当者', '完了日時']}
                pathName={'history'}
              />
              <Paginate
                contents={searchedTask[1]}
                perPage={taskPerPage}
                offset={offset}
                change={handleChangePage}
              />
            </div>
          ) : (
            <ErrorMessageWrapper>該当なし</ErrorMessageWrapper>
          )}
        </div>
      )}
    </>
  );
};

export default SearchIndex;
