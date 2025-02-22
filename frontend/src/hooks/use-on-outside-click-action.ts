import { useEffect } from 'react';

export function useOnOutsideClickAction(closestElSelector: string, fn: () => void) {
    useEffect(() => {
        const closeOnOutsideClick = (event: Event) => {
            const target = event.target as HTMLElement;

            if (!target.closest(closestElSelector)) {
                fn();
            }
        };

        document.documentElement.addEventListener('click', closeOnOutsideClick);

        return () => document.documentElement.removeEventListener('click', closeOnOutsideClick);
    }, [closestElSelector, fn]);
}
