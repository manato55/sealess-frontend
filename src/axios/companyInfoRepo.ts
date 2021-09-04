import { ErrorRounded } from '@material-ui/icons';
import { repository } from './repository';

async function changeSecName(info: object) {
  const path = 'company/change-sec-info';
  return await repository.post(path, info).catch((error) => error.response);
}

async function changeDepartment(info: object) {
  const path = 'change-department';
  return await repository.post(path, info).catch((error) => error.response);
}

async function changeJobTitle(info: object) {
  const path = 'company/change-job-title';
  return await repository.post(path, info).catch((error) => error.response);
}

async function changeDepName(info: object) {
  const path = 'company/change-dep-info';
  return await repository.post(path, info).catch((error) => error.response);
}

async function changeDepAdminDepartment(info: object) {
  const path = 'company/change-dep-admin-info';
  return await repository.post(path, info).catch((error) => error.response);
}

async function registerDepAdmin(info: object) {
  const path = 'company/register-dep-admin';
  return await repository.post(path, info).catch((error) => error.response);
}

async function inviteNormalUser(info: object) {
  const path = 'company/send-register-email';
  return await repository.post(path, info).catch((error) => error.response);
}

async function editNormalUserInfo(info: object) {
  const path = 'company/edit-normal-user-info';
  return await repository.post(path, info).catch((error) => error.response);
}

async function officialRegistryForNormalUser(info: object) {
  const path = 'official-registry';
  return await repository.post(path, info).catch((error) => error.response);
}

async function deleteNormalUser(userId: number) {
  const path = `delete-dep-user/${userId}`;
  return await repository.delete(path).catch((error) => error.response);
}

async function deleteDepAdmin(userId: number) {
  const path = `delete-dep-admin-user/${userId}`;
  return await repository.delete(path).catch((error) => error.response);
}

async function deleteDepartment(id: number) {
  const path = `company/delete-dep/${id}`;
  return await repository.delete(path).catch((error) => error.response);
}

async function deleteJobTitle(id: number) {
  const path = `company/delete-job-title/${id}`;
  return await repository.delete(path).catch((error) => error.response);
}

async function deleteSection(id: number) {
  const path = `company/delete-sec/${id}`;
  return await repository.delete(path).catch((error) => error.response);
}

async function passwordIssuanceMail(info: object) {
  const path = 're-password';
  return await repository.post(path, info).catch((error) => error.response);
}

async function reRegisterPassword(info: object) {
  const path = 're-register-password';
  return await repository.post(path, info).catch((error) => error.response);
}

async function registerCompany(info: object) {
  const path = 'company/register-company';
  return await repository.post(path, info).catch((error) => error.response);
}

async function adminRegistry(info: object) {
  const path = 'official-admin-registry';
  return await repository.post(path, info).catch((error) => error.response);
}

async function departmentRegistry(info: object) {
  const path = 'department-registry';
  return await repository.post(path, info).catch((error) => error.response);
}

async function sectionRegistry(info: object) {
  const path = 'section-registry';
  return await repository.post(path, info).catch((error) => error.response);
}

async function jobTitleRegistry(info: object) {
  const path = 'job-title-registry';
  return await repository.post(path, info).catch((error) => error.response);
}

export const companyInfoRepo = {
  changeSecName,
  changeDepName,
  changeJobTitle,
  changeDepartment,
  changeDepAdminDepartment,
  registerDepAdmin,
  inviteNormalUser,
  editNormalUserInfo,
  officialRegistryForNormalUser,
  deleteNormalUser,
  passwordIssuanceMail,
  reRegisterPassword,
  registerCompany,
  adminRegistry,
  deleteDepAdmin,
  departmentRegistry,
  sectionRegistry,
  jobTitleRegistry,
  deleteDepartment,
  deleteSection,
  deleteJobTitle,
};
