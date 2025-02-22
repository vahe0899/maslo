import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getCommonPageProps } from '@/api/common';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { CommonPageProps, NonUndefined } from '@/types';
import { tp } from '@/typograf';

const IndexPage = ({ h1 }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <DefaultLayout>
            <div className="wrapper">
                <h1>{tp(h1)}</h1>
            </div>
        </DefaultLayout>
    );
};

export default IndexPage;

type IndexPageProps = NonUndefined<
    CommonPageProps & {
        h1: string;
    }
>;

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
    const commonPageProps = await getCommonPageProps();

    return {
        props: {
            ...commonPageProps,
            bodyClass: 'index-page',
            meta: {
                ...commonPageProps.meta,
                title: 'Главная',
            },
            h1: 'Next.js boilerplate',
        } satisfies IndexPageProps,
    };
};
