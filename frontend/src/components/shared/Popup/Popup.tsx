import classNames from 'classnames';
import { HTMLAttributes, ReactNode, RefObject, forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOpenedPopupsValue, useSetOpenedPopupsState } from '@/atoms/opened-popups';

export interface Props extends HTMLAttributes<HTMLElement> {
    containerRef?: RefObject<HTMLDivElement>;
    /**
     * Уникальное имя попапа
     */
    name: string;
    /**
     * Рендерить ли оверлей
     */
    overlay?: boolean;
    onOpen?: () => void;
    onOpenComplete?: () => void;
    onClose?: () => void;
    onCloseComplete?: () => void;
    wrapperSlot?: ReactNode;
}

const root = typeof window !== 'undefined' ? document.querySelector('#modal-root') : null;

const Popup = forwardRef<HTMLDivElement, Props>(
    ({ wrapperSlot, children, containerRef, overlay = false, name, ...props }, ref) => {
        const openedPopups = useOpenedPopupsValue();
        const { closePopup } = useSetOpenedPopupsState();

        useEffect(() => {
            const onKeydown = (event: KeyboardEvent) => {
                if (event.code === 'Escape') {
                    closePopup(name);
                }
            };

            document.addEventListener('keydown', onKeydown);

            return () => document.removeEventListener('keydown', onKeydown);
        }, [closePopup, name]);

        const Component = (
            <div
                {...props}
                ref={ref}
                className={classNames(props.className, 'popup', { 'popup--opened': openedPopups.includes(name) })}
            >
                {overlay && <div className="popup-overlay" onClick={() => closePopup(name)}></div>}
                {wrapperSlot}
                <div ref={containerRef} className="popup-container">
                    {children}
                </div>
            </div>
        );

        return root ? createPortal(Component, root) : Component;
    },
);

Popup.displayName = 'Popup';

export default Popup;
