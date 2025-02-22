import { RefObject, createRef, useEffect, useState } from 'react';

export function useHold(ref?: RefObject<HTMLElement | Document>) {
    const [isHolding, setIsHolding] = useState(false);

    useEffect(() => {
        const el = ref?.current || document;

        const onPointerDown = (event: Event) => {
            event.stopPropagation();
            setIsHolding(true);
            el?.addEventListener('pointerup', onPointerUp);
        };

        const onPointerUp = (event: Event) => {
            event.stopPropagation();
            setIsHolding(false);
            el.removeEventListener('pointerup', onPointerUp);
        };

        el.addEventListener('pointerdown', onPointerDown);

        return () => {
            el.removeEventListener('pointerdown', onPointerDown);
            el.removeEventListener('pointerup', onPointerUp);
        };
    }, [ref]);

    return isHolding;
}
