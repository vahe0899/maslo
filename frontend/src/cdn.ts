const enabled = false;

export const CDN_DOMAIN = 'https://cdn.chipsa.ru'; // TODO: поменять!

export const fromCDN = (path: string) =>
    enabled &&
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_ENV === 'production' &&
    !path.startsWith(CDN_DOMAIN)
        ? CDN_DOMAIN + path
        : path;
