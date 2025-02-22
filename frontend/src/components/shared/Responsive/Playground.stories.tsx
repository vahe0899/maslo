import { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';
import React from 'react';
import Responsive from './Responsive';

const meta: Meta<typeof Responsive> = {
    component: Responsive,
    title: 'Components/Responsive/Playground',
    decorators: [
        (Story) => (
            <div className="story-wrapper">
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof Responsive>;

export const Playground: Story = {
    render: () => (
        <Responsive>
            <Image
                fill
                src="https://images.unsplash.com/photo-1682685797741-f0213d24418c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
                alt=""
            />
        </Responsive>
    ),
};
Playground.args = {};
