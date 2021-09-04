import HistoryIndex from '../../components/organisms/HistoryIndex';
import Head from 'next/head';

export const History = (): React.ReactElement => {
  return (
    <>
      <Head>
        <title>決定済み案件 | app</title>
        <meta name="description" content="決定済み案件ページです。" />
      </Head>
      <HistoryIndex />
    </>
  );
};

export default History;
