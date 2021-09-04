import { repository } from './repository';
import { Result } from '../lib/result';

async function registerDraft(info): Promise<any> {
  const headers = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const path = 'draft/register-draft';
  return await repository.post(path, info, headers).catch((error) => error.response);
}

async function deleteReturnedTask(id: number) {
  const path = `returned/remove-task/${id}`;
  return await repository.delete(path).catch((error) => error.response);
}

async function deleteRegisteredRoute(id: number) {
  const path = `route/remove-registered-route/${id}`;
  return await repository.delete(path).catch((error) => error.response);
}

async function registerRoute(info: object) {
  const path = 'route/register-route';
  return await repository.post(path, info).catch((error) => error.response);
}

async function searchTask(info: object) {
  const path = 'draft/search-task';
  return await repository.post(path, info).catch((error) => error.response);
}

export const draftRepo = {
  registerDraft,
  deleteReturnedTask,
  registerRoute,
  deleteRegisteredRoute,
  searchTask,
};
