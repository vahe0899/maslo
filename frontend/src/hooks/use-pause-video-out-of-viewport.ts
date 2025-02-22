import { useEffect, useState } from 'react';

export function usePauseVideoOutOfViewport<T extends HTMLVideoElement>(active = true) {
    const [ref, setRef] = useState<T | null>(null);

    useEffect(() => {
        let observer: IntersectionObserver | null;

        if (active) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.target instanceof HTMLVideoElement) {
                        if (entry.isIntersecting) {
                            entry.target.style.visibility = '';
                            entry.target.play();
                        } else {
                            entry.target.pause();
                            entry.target.style.visibility = 'hidden';
                        }
                    }
                });
            });

            if (ref) {
                observer.observe(ref);
            }
        }

        return () => observer?.disconnect();
    }, [active, ref]);

    return setRef;
}
