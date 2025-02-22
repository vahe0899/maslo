import { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import Playground from './Playground.stories';

const meta: Meta<typeof Button> = {
    component: Button,
    title: 'Components/Button/Features',
    parameters: Playground.parameters,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: { children: 'Button' },
};

export const Primary: Story = {
    args: { ...Default.args, variant: 'primary' },
};
