import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

export const mediaQueryDeviceState = atom<
    'horizontal-mobile' | 'vertical-mobile' | 'horizontal-tablet' | 'vertical-tablet' | 'desktop'
>({
    key: 'mediaQueryDeviceState',
    default: 'desktop',
});

export const useMediaQueryDeviceStateValue = () => useRecoilValue(mediaQueryDeviceState);
export const useSetMediaQueryDeviceState = () => useSetRecoilState(mediaQueryDeviceState);
