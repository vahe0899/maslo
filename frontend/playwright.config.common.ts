import { PlaywrightTestConfig, devices } from '@playwright/test';

// поменять/добавить страницы
export const pages = [''];

export const baseConfig: PlaywrightTestConfig = {
    globalSetup: require.resolve('./global-setup'),
    testDir: './tests',
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    use: {
        baseURL: process.env.NEXT_PUBLIC_HOST,
        headless: true,
        trace: 'on-first-retry',
        // httpCredentials: {
        //     username: '',
        //     password: '',
        // },
    },
    workers: process.env.CI ? 1 : undefined,
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            fullyParallel: true,
        },
    ],
    reporter: [process.env.CI ? ['null'] : ['html']],
};
