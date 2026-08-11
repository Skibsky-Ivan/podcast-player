export function debounce(fn: Function, delay: number = 400) {
  let timeoutId: any;

  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.call(this, ...args), delay);
  };
}
