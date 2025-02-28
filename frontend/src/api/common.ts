import { Cookies } from 'react-cookie';
import { CommonPageProps } from '@/types';

export const getCommonPageProps = async (cookies?: Partial<{ [key: string]: string }>): Promise<CommonPageProps> => {
    return {
        meta: {
            baseTitle: 'IT Масленница',
            description: 'IT Масленница',
            ogImage: '/img/og-image.jpg',
        },
        cookies: cookies ? new Cookies(cookies).getAll() : null,
        breadcrumbs: [],
    };
};
