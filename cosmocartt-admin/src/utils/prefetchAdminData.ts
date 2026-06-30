import { apiPath } from "../config/api";

const prefetchUrls = [
  apiPath("/api/products"),
  apiPath("/api/orders"),
  apiPath("/api/customers"),
  apiPath("/api/users"),
  apiPath("/api/cms"),
  apiPath("/api/campaigns"),

  // Sidebar modules using orders data
  apiPath("/api/orders"), // Dashboard
  apiPath("/api/orders"), // Payments
  apiPath("/api/orders"), // Reports
  apiPath("/api/orders"), // Refunds
  apiPath("/api/orders"), // Exchanges
  apiPath("/api/orders"), // Delivery
  apiPath("/api/orders"), // B2B order stats
];

export function prefetchAdminData() {
  setTimeout(() => {
    Array.from(new Set(prefetchUrls)).forEach((url) => {
      fetch(url).catch(() => {});
    });
  }, 600);
}
