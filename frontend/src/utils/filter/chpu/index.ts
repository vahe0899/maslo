type FilterRange = [number, number];

export type FilterParamsResult = Record<string, string | number | FilterRange>;

const FILTER_SEPARATOR = '-';
const FILTER_KEYWORD = '/filter/';

function parseRange(str: string): FilterRange {
    const regex = /from-(\d+)-to-(\d+)/;
    const match = str.match(regex);

    if (match) {
        const from = parseFloat(match[1]);
        const to = parseFloat(match[2]);
        return [from, to];
    }

    return [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
}

function parseRangeFrom(str: string): FilterRange {
    const regex = /from-(\d+)/;
    const match = str.match(regex);

    if (match) {
        const from = parseFloat(match[1]);
        return [from, Number.MAX_SAFE_INTEGER];
    }

    return [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
}

function parseRangeTo(str: string): FilterRange {
    const regex = /to-(\d+)/;
    const match = str.match(regex);

    if (match) {
        const to = parseFloat(match[1]);
        return [Number.MIN_SAFE_INTEGER, to];
    }

    return [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
}

export const chpu = {
    parseUrlToParams: (url: string): FilterParamsResult => {
        if (!url.includes(FILTER_KEYWORD)) {
            return {};
        }

        return (
            url
                .replace(/\/$/, '')
                .split(FILTER_KEYWORD)[1]
                ?.split('/')
                .reduce<FilterParamsResult>((obj, str) => {
                    // direct value ('is')
                    if (str.includes(`${FILTER_SEPARATOR}is${FILTER_SEPARATOR}`)) {
                        const arr = str.split(`${FILTER_SEPARATOR}is${FILTER_SEPARATOR}`);
                        obj[arr[0]] = arr[1];
                    }
                    // Range: from-to
                    else if (str.includes('from') && str.includes('to')) {
                        obj[str.split(`${FILTER_SEPARATOR}from`)[0]] = parseRange(str);
                    }
                    // Range: from
                    else if (str.includes('from') && !str.includes('to')) {
                        obj[str.split(`${FILTER_SEPARATOR}from`)[0]] = parseRangeFrom(str);
                    }
                    // Range: to
                    else if (!str.includes('from') && str.includes('to')) {
                        obj[str.split(`${FILTER_SEPARATOR}to`)[0]] = parseRangeTo(str);
                    }

                    return obj;
                }, {}) ?? {}
        );
    },

    encodeParamsToUrl: (params: FilterParamsResult): string => {
        const entries = Object.entries(params);

        if (entries.length === 0) {
            return '';
        }

        return (
            `${FILTER_KEYWORD}` +
            entries
                .reduce<string[]>((arr, [key, value]) => {
                    if (typeof value === 'string' || typeof value === 'number') {
                        arr.push(`${key}${FILTER_SEPARATOR}is${FILTER_SEPARATOR}${value}`);
                    } else {
                        arr.push(
                            `${key}${FILTER_SEPARATOR}from${FILTER_SEPARATOR}${value[0]}${FILTER_SEPARATOR}to${FILTER_SEPARATOR}${value[1]}`,
                        );
                    }

                    return arr;
                }, [])
                .join('/')
        );
    },

    convertParamsToString: (params: FilterParamsResult) =>
        Object.entries(params)
            .map(([key, value]) => `${key}=${value}`, '')
            .join('&'),
};
