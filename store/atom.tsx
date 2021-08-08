import { atom } from 'recoil'

export const http = atom({
    key: 'httpStatuCode',
    default: null,
})

export const userStatus = atom({
    key: 'user',
    default: null,
})

export const loginErrorMessage = atom({
    key: 'login',
    default: null,
})

export const isNavToggle = atom({
    key: 'toggle',
    default: null
})