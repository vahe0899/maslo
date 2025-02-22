import classnames from 'classnames';
import React, { forwardRef } from 'react';
import { usePageTransition } from '@/transitions/page-transitions';

interface Props extends React.HTMLAttributes<HTMLElement> {}

const DefaultLayout = forwardRef<HTMLDivElement, Props>(({ children, ...props }, ref) => {
    usePageTransition();

    return (
        <div {...props} ref={ref} className={classnames('page js-page', props.className)}>
            {children}
        </div>
    );
});

DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
