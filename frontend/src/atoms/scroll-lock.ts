import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const scrollLockState = atom<boolean>({
    key: 'scrollLockState',
    default: false,
});

export const useScrollLockStateValue = () => useRecoilValue(scrollLockState);
export const useSetScrollLockState = () => useSetRecoilState(scrollLockState);
