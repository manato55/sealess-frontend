import { atom } from 'recoil';

export const http = atom({
  key: 'httpStatuCode',
  default: null,
});

export const userStatus = atom({
  key: 'user',
  default: null,
});

export const authErrorMessage = atom({
  key: 'authError',
  default: {
    label: false,
    general: null,
    name: [],
    email: [],
    password: [],
    department: [],
    section: [],
    jobTitle: [],
    content: [],
    route: [],
    title: [],
  },
});

export const eachErrorFlag = atom({
  key: 'errorFlag',
  default: {
    name: false,
    email: false,
    password: false,
    department: false,
    section: false,
    jobTitle: false,
    content: false,
    route: false,
    title: false,
    file: false,
  },
});

export const isNavToggle = atom({
  key: 'toggle',
  default: null,
});

export const searchKeyword = atom({
  key: 'keyword',
  default: {
    task: null,
    name: null,
    year: null,
  },
});
