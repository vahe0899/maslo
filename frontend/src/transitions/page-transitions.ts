import { usePresence } from 'framer-motion';
import { useEffect } from 'react';
import {
    DEFAULT_MODE,
    DEFAULT_NAME,
    PageTransitionName,
    usePageTransitionValue,
    useSetIsPageTransitioningState,
    useSetPageTransitionState,
} from '@/atoms/page-transition';
import { leaveInstant } from './leave-instant';

export type LeaveFn = (data: { targetElement?: Element | null }) => Promise<void>;

const leaveFnMap: Record<PageTransitionName, LeaveFn> = {
    default: leaveInstant,
    instant: leaveInstant,
};

export const usePageTransition = () => {
    const { name, targetElement } = usePageTransitionValue();
    const setLeaveTransition = useSetPageTransitionState();
    const [isPresent, safeToRemove] = usePresence();
    const setIsTransitioning = useSetIsPageTransitioningState();

    useEffect(() => {
        if (!isPresent) {
            setIsTransitioning(true);
            leaveFnMap[name]({ targetElement })
                .then(() => {
                    safeToRemove();
                    setLeaveTransition({ mode: DEFAULT_MODE, name: DEFAULT_NAME });
                })
                .finally(() => {
                    setIsTransitioning(false);
                });
        }
    }, [setLeaveTransition, isPresent, name, safeToRemove, setIsTransitioning, targetElement]);
};
