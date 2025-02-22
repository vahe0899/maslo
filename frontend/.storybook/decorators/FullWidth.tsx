import { Decorator } from '@storybook/react';

export const FullWidthDecorator: Decorator = (Story) => (
    <div style={{ width: '95vw' }}>
        <Story />
    </div>
);
