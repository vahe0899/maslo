import { useRouter } from 'next/router';

export const DEFAULT_LOCALE = 'ru';

export const useLocale = () => {
    const router = useRouter();
    return router.locale || DEFAULT_LOCALE;
};
