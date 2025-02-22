// Cubic

export function easeInCubic(x: number): number {
    return x * x * x;
}

export function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
}

export function easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// Quart

export function easeInQuart(x: number): number {
    return x * x * x * x;
}

export function easeOutQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4);
}

export function easeInOutQuart(x: number): number {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}
