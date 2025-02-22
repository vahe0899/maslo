import { AnimatePresence } from 'framer-motion';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { usePageTransitionValue } from '@/atoms/page-transition';
import AppHead from '@/components/general/AppHead';
import AppInits from '@/components/general/AppInits';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Providers from '@/components/layout/Providers';
import LayoutGrid from '@/components/utils/LayoutGrid';
import { usePrevious } from '@/hooks/use-previous';
import { CommonPageProps } from '@/types';
import { calculateScrollbarWidth } from '@/utils/calculate-scrollbar-width';
import vhMobileFix from '@/utils/vh-mobile-fix';
import '../css/app.scss';
import '../css/base/_fonts.scss';

if (typeof window !== 'undefined') {
    document.documentElement.classList.add('js-ready');
    vhMobileFix();
    calculateScrollbarWidth();
}

const AnimatedPage = ({ pageProps, children }: { pageProps: CommonPageProps; children: ReactNode }) => {
    const prevBodyClass = usePrevious(pageProps.bodyClass);
    const { mode } = usePageTransitionValue();

    return (
        <AnimatePresence
            mode={mode}
            onExitComplete={() => {
                if (prevBodyClass) {
                    document.documentElement.classList.remove(...prevBodyClass.split(' '));
                }

                if (pageProps.bodyClass) {
                    document.documentElement.classList.add(...pageProps.bodyClass.split(' '));
                }

                window.scrollTo({ top: 0, behavior: 'auto' });
                document.dispatchEvent(new Event('new-page-ready'));
            }}
        >
            {children}
        </AnimatePresence>
    );
};

const App = ({ Component, pageProps }: AppProps<CommonPageProps>) => {
    const router = useRouter();

    useEffect(() => {
        history.scrollRestoration = 'manual';
    }, []);

    return (
        <Providers>
            <AppInits />
            <AppHead meta={pageProps.meta} />
            <Header />
            <main className="main">
                <AnimatedPage pageProps={pageProps}>
                    <Component {...pageProps} key={router.asPath} />
                </AnimatedPage>
            </main>
            <Footer />
            {process.env.NODE_ENV === 'development' && <LayoutGrid />}
        </Providers>
    );
};

export default App;
