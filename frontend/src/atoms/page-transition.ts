import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

export type PageTransitionName = 'default' | 'instant';

export const DEFAULT_MODE = 'sync';
export const DEFAULT_NAME = 'default';

const pageTransitionState = atom<{
    mode: 'wait' | 'sync' | 'popLayout';
    name: PageTransitionName;
    targetElement?: Element | null;
}>({
    key: 'pageTransitionState',
    default: {
        mode: DEFAULT_MODE,
        name: DEFAULT_NAME,
    },
});

export const usePageTransitionValue = () => useRecoilValue(pageTransitionState);
export const useSetPageTransitionState = () => useSetRecoilState(pageTransitionState);

const isPageTransitioningState = atom<boolean>({
    key: 'isPageTransitioningState',
    default: false,
});

export const useIsPageTransitioningValue = () => useRecoilValue(isPageTransitioningState);
export const useSetIsPageTransitioningState = () => useSetRecoilState(isPageTransitioningState);
