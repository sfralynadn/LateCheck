export function debounce<T extends (...args: any[]) => void>(fn: T, wait: number): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null;

    return function (...args: Parameters<T>) {
        if (timer) {
            clearTimeout(timer); // clear any pre-existing timer
        }

        timer = setTimeout(() => {
            fn.apply(this, args); // call the function if time expires
        }, wait);
    };
}
