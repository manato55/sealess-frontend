import repository from './repository';

export const fetcher = async (path: string) => {
  const res = await repository.get(path).catch((error) => error.response);
  return res.data;
};
