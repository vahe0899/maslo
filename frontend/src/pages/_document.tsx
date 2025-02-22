import classNames from 'classnames';
import { DocumentProps, Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

function Document({ __NEXT_DATA__ }: DocumentProps) {
    const { bodyClass } = __NEXT_DATA__.props.pageProps;

    return (
        <Html lang="ru" className={classNames('no-js', bodyClass)}>
            <Head />

            <body>
                <Script
                    id="no-js"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `document.documentElement.classList.replace('no-js', 'js');`,
                    }}
                ></Script>
                <Main />
                <div id="modal-root"></div>
                <NextScript />
            </body>
        </Html>
    );
}

export default Document;
