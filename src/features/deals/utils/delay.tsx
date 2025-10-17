export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function delayedPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.all([promise, delay(ms)]).then((data) => data[0]);
}
