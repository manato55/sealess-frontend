import { atom } from 'recoil'

export const isAsynced = atom({
    key: 'async',
    default: false,
})