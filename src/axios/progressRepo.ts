import { repository } from './repository';
import { Result } from '../lib/result';

async function actionInProgress(info: object): Promise<any> {
  const path = 'progress/action-inprogress';
  return await repository.post(path, info).catch((error) => error.response);
}

async function actionInEscalation(info: object): Promise<any> {
  const path = 'progress/action-inescalation';
  return await repository.post(path, info).catch((error) => error.response);
}

async function returnToDrafter(info: object): Promise<any> {
  const path = 'progress/return';
  return await repository.post(path, info).catch((error) => error.response);
}

async function downloadFile(info: object): Promise<any> {
  const path = 'progress/fetch-file';
  const type = {
    responseType: 'blob',
  };
  return await repository.downloadPost(path, info, type).catch((error) => error.response);
}

async function removeFile(info: object): Promise<any> {
  const path = 'returned/remove-file';
  return await repository.downloadPost(path, info).catch((error) => error.response);
}

export const progressRepo = {
  actionInProgress,
  actionInEscalation,
  returnToDrafter,
  downloadFile,
  removeFile,
};
