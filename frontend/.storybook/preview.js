import { RecoilRoot } from 'recoil';
import AppInits from '../src/components/general/AppInits';
import '../src/css/app.scss';
import './_storybook-fonts.scss';
import './styles.scss';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    layout: 'centered',
    backgrounds: {
        default: 'light',
        values: [
            {
                name: 'dark',
                value: '#050a47',
            },
            {
                name: 'light',
                value: '#fff',
            },
        ],
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

export const decorators = [
    (Story) => (
        <RecoilRoot>
            <AppInits />
            <Story />
        </RecoilRoot>
    ),
];
