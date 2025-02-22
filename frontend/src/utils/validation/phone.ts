export const phoneRegex = /^\+?\d{7,14}$/;

export function isPhone(string: string): boolean {
    return phoneRegex.test(string.replace(/[\s()+\-\.]|ext/gi, ''));
}
