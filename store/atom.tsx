import { atom } from 'recoil'

export const http = atom({
    key: 'httpStatuCode',
    default: null,
})

export const userStatus = atom({
    key: 'user',
    default: null,
})