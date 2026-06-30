const CACHE_PREFIX = "cc_api_cache:";

export function readCachedApiData<T = any>(url: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + url);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    if (!parsed?.body) return fallback;

    const data = JSON.parse(parsed.body);

    if (data?.success && data.products) return data.products;
    if (data?.success && data.orders) return data.orders;
    if (Array.isArray(data)) return data;
    if (data?.users) return data.users;
    if (data?.customers) return data.customers;

    return data || fallback;
  } catch {
    return fallback;
  }
}
