import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface Props {
    meta: Partial<{
        baseTitle: string;
        title: string;
        description: string;
        ogImage: string;
    }>;
}

const AppHead = ({ meta }: Props) => {
    const pathname = usePathname();
    const title = meta.title ? `${meta.title} — ${meta.baseTitle}` : meta.baseTitle;

    return (
        <Head>
            <meta charSet="utf-8" />
            <title>{title}</title>
            <meta name="description" content={meta.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            {process.env.HOST && (
                <meta property="og:url" content={process.env.HOST + (pathname === '/' ? '' : pathname)} />
            )}
            <meta property="og:locale" content="ru" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:image" content={meta.ogImage} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:image" content={meta.ogImage} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={meta.description} />
            <link rel="icon" href="/img/favicon/favicon.ico" />
            {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}

            {/* <link
                rel="preload"
                href="/fonts/FormaDJRText-Regular.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
            /> */}
        </Head>
    );
};

export default AppHead;
