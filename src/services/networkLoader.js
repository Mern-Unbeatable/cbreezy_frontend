let activeRequests = 0;
const listeners = new Set();

const notify = () => {
  const isLoading = activeRequests > 0;
  listeners.forEach((listener) => listener(isLoading));
};

export const beginNetworkRequest = () => {
  activeRequests += 1;
  notify();
};

export const endNetworkRequest = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  notify();
};

export const subscribeNetworkLoading = (listener) => {
  listeners.add(listener);
  listener(activeRequests > 0);

  return () => {
    listeners.delete(listener);
  };
};

export const isNetworkLoading = () => activeRequests > 0;
