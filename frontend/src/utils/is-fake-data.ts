export const isFakeData = (query: Record<string, any> | string[][] | string | URLSearchParams) =>
    typeof new URLSearchParams(query).get('fake-data') === 'string';
