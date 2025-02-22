import path from 'path';
import { fromCDN } from '@/cdn';

export default function imageLoader({ src, width, quality = 80 }) {
    const { dir, ext } = path.parse(src);
    return fromCDN(
        /(png|jpe?g|webp|avif)/.test(ext)
            ? `/nextapi/optimize?src=${encodeURIComponent(src)}&w=${width}&q=${quality}`
            : src,
    );
}
