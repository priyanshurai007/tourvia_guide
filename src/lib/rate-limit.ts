interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitStore {
  [key: string]: {
    tokens: number;
    lastReset: number;
  };
}

export function rateLimit(options: RateLimitOptions) {
  const store: RateLimitStore = {};

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now();
        const windowStart = now - options.interval;

        if (!store[token]) {
          store[token] = {
            tokens: limit,
            lastReset: now,
          };
        }

        const current = store[token];

        if (now - current.lastReset > options.interval) {
          current.tokens = limit;
          current.lastReset = now;
        }

        if (current.tokens > 0) {
          current.tokens--;
          resolve();
        } else {
          reject(new Error('Rate limit exceeded'));
        }
      }),
  };
} 