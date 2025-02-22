import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { chpu } from './utils/filter/chpu';

export function middleware(req: NextRequest) {
    const params = chpu.parseUrlToParams(req.url);

    return NextResponse.rewrite(
        new URL(`${req.url.replace(/\/filter\/.*/, '')}?${chpu.convertParamsToString(params)}`, req.url),
    );
}

export const config = {
    matcher: ['/(.*)/filter/:path*'],
};
