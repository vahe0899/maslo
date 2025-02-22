import { Cookies } from 'react-cookie';
import { CommonPageProps } from '@/types';

export const getCommonPageProps = async (cookies?: Partial<{ [key: string]: string }>): Promise<CommonPageProps> => {
    return {
        meta: {
            baseTitle: '[APP_TITLE]',
            description: '[APP_DESCRIPTION]',
            ogImage: '/img/og-image.jpg',
        },
        cookies: cookies ? new Cookies(cookies).getAll() : null,
        breadcrumbs: [],
    };
};
