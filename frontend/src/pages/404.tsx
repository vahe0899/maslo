import { GetStaticProps } from 'next';
import ErrorPageLayout from '@/components/layout/ErrorPageLayout';
import { CommonPageProps } from '@/types';

const NotFoundPage = () => {
    return <ErrorPageLayout errorNumber={404} />;
};

export default NotFoundPage;

export const getStaticProps: GetStaticProps<CommonPageProps> = async () => {
    return {
        props: {
            meta: {
                baseTitle: '[APP_TITLE]',
                title: 'Page not found',
                ogImage: '/img/og-image.jpg',
            },
            breadcrumbs: [],
            cookies: null,
            bodyClass: 'error-page',
        },
    };
};
