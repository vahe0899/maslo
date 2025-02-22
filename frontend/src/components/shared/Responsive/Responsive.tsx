import classNames from 'classnames';
import { LinkProps } from 'next/link';
import { Children, HTMLAttributes, ReactElement, cloneElement, forwardRef, isValidElement } from 'react';
import Link from '@/components/shared/Link';

type Props = HTMLAttributes<HTMLElement> &
    Partial<LinkProps> & {
        /**
         * Какой тег рендерить
         */
        tag?: keyof JSX.IntrinsicElements | typeof Link;
    };

const Responsive = forwardRef<HTMLDivElement, Props>(({ tag = 'div', children, ...props }, ref) => {
    const Component = tag as any;

    return (
        <Component {...props} ref={ref} className={classNames(props.className, 'responsive')}>
            {Children.map(
                children,
                (child) =>
                    isValidElement(child) &&
                    cloneElement(child as ReactElement<Props>, {
                        className: classNames(child.props.className, 'responsive__item'),
                    }),
            )}
        </Component>
    );
});

Responsive.displayName = 'Responsive';

export default Responsive;
