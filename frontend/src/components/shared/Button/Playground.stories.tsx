import { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
    component: Button,
    title: 'Components/Button/Playground',
    // parameters: {
    //     design: {
    //         type: 'figma',
    //         url: 'https://www.figma.com/file/BR6WH9PQaI0nZXLHH7gUlx/chipsa-new?node-id=1758-658&t=cnJLXRVqxUACRRd7-0',
    //     },
    // },
};

export default meta;

export type Story = StoryObj<typeof Button>;

export const Playground = {
    args: {
        children: 'Button',
        variant: 'primary',
        disabled: false,
    },
};
