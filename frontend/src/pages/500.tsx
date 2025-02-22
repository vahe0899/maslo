import { GetStaticProps } from 'next';
import ErrorPageLayout from '@/components/layout/ErrorPageLayout';
import { CommonPageProps } from '@/types';

const ServerErrorPage = () => {
    return <ErrorPageLayout errorNumber={500} />;
};

export default ServerErrorPage;

export const getStaticProps: GetStaticProps<CommonPageProps> = async () => {
    return {
        props: {
            meta: {
                baseTitle: '[APP_TITLE]',
                title: 'Interval Server Error',
                ogImage: '/img/og-image.jpg',
            },
            breadcrumbs: [],
            cookies: null,
            bodyClass: 'error-page',
        },
    };
};
