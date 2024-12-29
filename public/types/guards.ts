export function notNull<T>(argument: T | null): argument is T {
    return argument !== null;
}