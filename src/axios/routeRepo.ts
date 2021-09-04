import { repository } from './repository';
import { Result } from '../lib/result';

async function registerAgentUser(info: object): Promise<any> {
  const path = 'route/agent-setting';
  return await repository.post(path, info).catch((error) => error.response);
}

async function agentStatus2False(): Promise<any> {
  const path = 'route/agent-status-2false';
  return await repository.post(path, null).catch((error) => error.response);
}

async function agentStatus2True(): Promise<any> {
  const path = 'route/agent-status-2true';
  return await repository.post(path, null).catch((error) => error.response);
}

export const routeRepo = {
  registerAgentUser,
  agentStatus2False,
  agentStatus2True,
};
