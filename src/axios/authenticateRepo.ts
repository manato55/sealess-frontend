import { repository } from './repository';
import { Result } from '../lib/result';
import { LoginUser } from '../hooks/useAuth';

async function login(info): Promise<Result<LoginUser>> {
  const path = 'login';
  return await repository.post(path, info).catch((error) => error.response);
}

async function logout(): Promise<any> {
  const path = 'logout';
  return await repository.post(path, null).catch((error) => error.response);
}

export const authenticateRepo = {
  login,
  logout,
};
