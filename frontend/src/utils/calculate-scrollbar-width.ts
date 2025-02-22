export const calculateScrollbarWidth = () => {
    const CONTAINER_WIDTH = 100;

    const scrollbarWidthOuter = document.createElement('div');
    scrollbarWidthOuter.id = 'scrollbar-width--outer';
    scrollbarWidthOuter.style.cssText = `
            z-index: -9999;
            position: absolute;
            visibility: hidden;
            width: ${CONTAINER_WIDTH}px;
            margin-left: -${CONTAINER_WIDTH}px;
            overflow: scroll;
        `;

    document.body.appendChild(scrollbarWidthOuter);

    const scrollbarWidthInner = document.createElement('div');
    scrollbarWidthInner.id = 'scrollbar-width--inner';
    scrollbarWidthInner.style.width = `${CONTAINER_WIDTH}%`;

    scrollbarWidthOuter.appendChild(scrollbarWidthInner);

    let scrollbarWidthLast = 0;

    const calculateActualScrollbarWidth = () => {
        const scrollbarWidth = CONTAINER_WIDTH - scrollbarWidthInner.offsetWidth;
        if (scrollbarWidthLast !== scrollbarWidth) {
            document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
            scrollbarWidthLast = scrollbarWidth;
        }
    };

    window.addEventListener('resize', calculateActualScrollbarWidth);
    calculateActualScrollbarWidth();

    const _calculateScrollbarWidth = () => {
        const diff = window.innerWidth - document.documentElement.offsetWidth;
        const scrollbarWidth = diff > 1 ? diff : 0;

        document.documentElement.style.setProperty('--actual-scrollbar-width', `${scrollbarWidth}px`);
    };

    const resizeObserver = window?.ResizeObserver ? new ResizeObserver(_calculateScrollbarWidth) : null;

    if (typeof window !== 'undefined') {
        if (resizeObserver) {
            resizeObserver.observe(document.documentElement);
        } else {
            window.addEventListener('resize', _calculateScrollbarWidth);
        }
    }

    _calculateScrollbarWidth();

    return () => {
        if (typeof window !== 'undefined') {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', calculateActualScrollbarWidth);
            window.removeEventListener('resize', _calculateScrollbarWidth);
        }
    };
};
