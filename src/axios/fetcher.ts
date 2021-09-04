import { repository } from './repository';

export async function fetcher(path: string) {
  const res = await repository.get(path);
  return res.data;
}
