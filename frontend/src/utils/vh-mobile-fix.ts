/* eslint-disable import/no-anonymous-default-export */
import debounce from 'lodash.debounce';
import { viewport } from '@/utils/viewport';

export default () => {
    const setVh = () => {
        const vh = viewport.height * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    const calculateVhOnResize = debounce(setVh, 50);

    window.addEventListener('resize', calculateVhOnResize);
    window.addEventListener('orientationchange', calculateVhOnResize);

    return () => {
        window.removeEventListener('resize', calculateVhOnResize);
        window.removeEventListener('orientationchange', calculateVhOnResize);
    };
};
