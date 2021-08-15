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
    general: false,
    name: [],
    email: [],
    password: [],
    department: [],
    section: [],
    jobTitle: [],
    content: [],
    route: [],
    title: [],
    // file: [],
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
