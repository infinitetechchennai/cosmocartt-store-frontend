import { apiPath } from "../config/api";

const prefetchUrls = [
  apiPath("/api/products"),
  apiPath("/api/products/catalog"),
  apiPath("/api/products/brands"),
  apiPath("/api/campaigns"),
  apiPath("/api/cms"),
];

export function prefetchAppData() {
  setTimeout(() => {
    prefetchUrls.forEach((url) => {
      fetch(url).catch(() => {});
    });
  }, 800);
}
