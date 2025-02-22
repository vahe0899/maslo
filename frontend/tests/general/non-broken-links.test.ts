import { test } from '@playwright/test';
import { pages } from '../../playwright.config.common';

test.describe('Non-broken links', () => {
    pages.forEach((url) => {
        test(url, async ({ page }) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {
                throw new Error(`Error reaching ${url}`);
            });

            const links = await page.evaluate(() => {
                const BANNED_URLS = [
                    'https://instagram.com',
                    'https://www.instagram.com',
                    'https://twitter.com',
                    'https://facebook.com',
                    'https://t.me',
                    'https://wa.me',
                ];
                const elements = Array.from(document.getElementsByTagName('a')).filter(
                    (el) =>
                        !el.href.startsWith('mailto:') &&
                        !el.href.startsWith('tel:') &&
                        !el.href.endsWith('.pdf') && // https://bugs.chromium.org/p/chromium/issues/detail?id=761295
                        !BANNED_URLS.some((url) => el.href.startsWith(url)),
                );
                return elements.map((a) => a.href);
            });

            for (const link of links) {
                page.goto(link, { waitUntil: 'domcontentloaded' })
                    .then((response) => {
                        if (response && response.status() >= 400) {
                            throw new Error(`Link "${link}" is broken: HTTP status code ${response.status()}`);
                        } else {
                            console.log(`Link "${link}": OK`);
                        }
                    })
                    .catch((err) => {
                        throw new Error(`Link "${link}" is broken: ${err}`);
                    });
            }
        });
    });
});
