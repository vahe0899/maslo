declare module 'lighthouse';
declare module '*.glsl';
declare module '*.svg';
declare module '*.svg?url';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.webp';
declare module '*.avif';
declare module '*.gif';
declare module '*.basis';
declare module '*.ktx2';
declare module '*.glb';

declare namespace JSX {
    interface IntrinsicElements {
        tag: HTMLAttributes;
    }
}

interface Window {
    ymaps3?: any;
    ym?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: Record<string, any>;
}
