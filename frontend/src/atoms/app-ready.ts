import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

export const appReadyState = atom<boolean>({
    key: 'appReadyState',
    default: false,
});

export const useAppReadyStateValue = () => useRecoilValue(appReadyState);
export const useAppReadySetState = () => useSetRecoilState(appReadyState);
