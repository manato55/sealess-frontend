import repository from './repository';

export const fetcher = async (path: string) => {
  const res = await repository.get(path);
  return res.data;
};
