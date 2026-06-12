import {
  StockAlert,
  BestSeller,
  User,
  Order,
  B2BClient,
  PaymentTransaction
} from "./types";

export const initialStockAlerts: StockAlert[] = [
  { id: "s1", sku: "SEV-TEE-BLK-M", name: "Classic Seven Tee - Charcoal Black (M)", stock: 0, threshold: 10, status: "Out of Stock" },
  { id: "s2", sku: "SEV-TEE-WHT-L", name: "Oversized Seven Tee - Arctic White (L)", stock: 2, threshold: 10, status: "Low Stock" },
  { id: "s3", sku: "SEV-HD-RED-XL", name: "Premium Seven Hoodie - Crimson Red (XL)", stock: 1, threshold: 5, status: "Low Stock" },
  { id: "s4", sku: "SEV-JGR-GRY-S", name: "Athletic Joggers - Ash Grey (S)", stock: 0, threshold: 8, status: "Out of Stock" },
  { id: "s5", sku: "SEV-CAP-BLK-OS", name: "Signature Baseball Cap - Black (OS)", stock: 3, threshold: 15, status: "Low Stock" },
  { id: "s6", sku: "SEV-SCK-WHT-M", name: "Crew Socks 3-Pack - White (M)", stock: 0, threshold: 12, status: "Out of Stock" }
];

export const initialBestSellers: BestSeller[] = [
  { id: "b1", name: "Classic Seven Tee - Charcoal Black", sales: 142, revenue: 112180 },
  { id: "b2", name: "Oversized Seven Tee - Arctic White", sales: 98, revenue: 77420 },
  { id: "b3", name: "Premium Seven Hoodie - Crimson Red", sales: 74, revenue: 147260 },
  { id: "b4", name: "Athletic Joggers - Ash Grey", sales: 56, revenue: 83440 }
];

export const initialUsers: User[] = [
  { id: "u1", name: "Abhishek Sharma", email: "abhishek@seven.co", role: "Manager", status: "Active", joinedDate: "2026-05-15" },
  { id: "u2", name: "Priya Patel", email: "priya@seven.co", role: "Support Agent", status: "Active", joinedDate: "2026-05-18" },
  { id: "u3", name: "Rohan Das", email: "rohan@external.co", role: "B2B Client Representative", status: "Active", joinedDate: "2026-05-20" },
  { id: "u4", name: "Sneha Nair", email: "sneha@seven.co", role: "Admin", status: "Active", joinedDate: "2026-05-02" },
  { id: "u5", name: "Vikram Singh", email: "vikram@retail.com", role: "Customer", status: "Inactive", joinedDate: "2026-05-22" }
];

export const initialOrders: Order[] = [
  { id: "ORD-2026-001", customer: "Rohan Das (Apex Logistics)", type: "B2B", amount: 48500, status: "Processing", date: "2026-05-28" },
  { id: "ORD-2026-002", customer: "Vikram Singh", type: "B2C", amount: 2499, status: "Delivered", date: "2026-05-27" },
  { id: "ORD-2026-003", customer: "Karan Johar", type: "B2C", amount: 1899, status: "Pending", date: "2026-05-29" },
  { id: "ORD-2026-004", customer: "Sumit Traders", type: "B2B", amount: 125000, status: "Pending", date: "2026-05-29" },
  { id: "ORD-2026-005", customer: "Anjali Gupta", type: "B2C", amount: 4500, status: "Cancelled", date: "2026-05-26" }
];

export const initialB2BClients: B2BClient[] = [
  { id: "B2B-001", companyName: "Apex Logistics Ltd.", contactName: "Rohan Das", creditLimit: 500000, outstandingBalance: 48500, status: "Approved" },
  { id: "B2B-002", companyName: "Sumit Traders & Co.", contactName: "Sumit Gupta", creditLimit: 250000, outstandingBalance: 125000, status: "Pending" },
  { id: "B2B-003", companyName: "Matrix Retail Ventures", contactName: "Tina Sen", creditLimit: 1000000, outstandingBalance: 0, status: "Approved" },
  { id: "B2B-004", companyName: "Zenith Apparel Group", contactName: "Vijay Mallya", creditLimit: 150000, outstandingBalance: 75000, status: "Suspended" }
];

export const initialTransactions: PaymentTransaction[] = [
  { id: "TXN-908234", orderId: "ORD-2026-001", method: "Bank Transfer", amount: 48500, status: "Success", timestamp: "2026-05-28 14:32:10" },
  { id: "TXN-908235", orderId: "ORD-2026-002", method: "Razorpay (UPI)", amount: 2499, status: "Success", timestamp: "2026-05-27 10:15:22" },
  { id: "TXN-908236", orderId: "ORD-2026-003", method: "COD", amount: 1899, status: "Pending", timestamp: "2026-05-29 09:05:00" },
  { id: "TXN-908237", orderId: "ORD-2026-004", method: "Net Banking", amount: 125000, status: "Pending", timestamp: "2026-05-29 11:45:12" }
];
