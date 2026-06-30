const CACHE_PREFIX = "cc_api_cache:";
const DEFAULT_TTL = 5 * 60 * 1000;
const LONG_TTL = 30 * 60 * 1000;

const shouldCache = (url: string, method: string) => {
  if (method !== "GET") return false;
  if (!url.includes("/api/")) return false;

  const blocked = [
    "/api/auth",
    "/api/customers/login",
    "/api/customers/register",
    "/api/customers/verify",
    "/api/payment",
    "/api/invoice",
    "/export",
    "/import",
  ];

  return !blocked.some((path) => url.includes(path));
};

const getTTL = (url: string) => {
  if (
    url.includes("/api/products") ||
    url.includes("/api/cms") ||
    url.includes("/api/campaigns")
  ) {
    return LONG_TTL;
  }

  return DEFAULT_TTL;
};

const cacheKey = (url: string) => CACHE_PREFIX + url;

const clearApiCache = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
};

export function installFetchCache() {
  if ((window as any).__COSMOCARTT_FETCH_CACHE__) return;
  (window as any).__COSMOCARTT_FETCH_CACHE__ = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    const method = String(init?.method || "GET").toUpperCase();

    if (method !== "GET") {
      const response = await originalFetch(input, init);

      if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        clearApiCache();
      }

      return response;
    }

    if (!shouldCache(url, method)) {
      return originalFetch(input, init);
    }

    const key = cacheKey(url);
    const cachedRaw = localStorage.getItem(key);

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        const ttl = getTTL(url);
        const freshEnough = Date.now() - cached.timestamp < ttl;

        originalFetch(input, init)
          .then(async (freshResponse) => {
            if (!freshResponse.ok) return;

            const body = await freshResponse.clone().text();

            localStorage.setItem(
              key,
              JSON.stringify({
                timestamp: Date.now(),
                status: freshResponse.status,
                body,
                contentType: freshResponse.headers.get("content-type") || "application/json",
              })
            );
          })
          .catch(() => {});

        if (freshEnough || cached.body) {
          return new Response(cached.body, {
            status: cached.status || 200,
            headers: {
              "Content-Type": cached.contentType || "application/json",
              "X-CosmoCartt-Cache": "HIT",
            },
          });
        }
      } catch {
        localStorage.removeItem(key);
      }
    }

    const response = await originalFetch(input, init);

    if (response.ok) {
      const body = await response.clone().text();

      localStorage.setItem(
        key,
        JSON.stringify({
          timestamp: Date.now(),
          status: response.status,
          body,
          contentType: response.headers.get("content-type") || "application/json",
        })
      );
    }

    return response;
  };
}
