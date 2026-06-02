export type TimeFilter = "Today" | "Weekly" | "Monthly" | "All";

export interface KPICardData {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
}

export interface AnalyticsData {
  name: string;
  b2b: number;
  b2c: number;
}

export interface DeliveryStat {
  name: string;
  value: number;
  color: string;
}

export interface StockAlert {
  id: string;
  sku: string;
  name: string;
  stock: number;
  threshold: number;
  status: "Out of Stock" | "Low Stock";
}

export interface BestSeller {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  joinedDate: string;
}

export interface Order {
  id: string;
  customer: string;
  type: "B2B" | "B2C";
  amount: number;
  status: "Delivered" | "Pending" | "Processing" | "Cancelled";
  date: string;
}

export interface B2BClient {
  id: string;
  companyName: string;
  contactName: string;
  creditLimit: number;
  outstandingBalance: number;
  status: "Approved" | "Pending" | "Suspended";
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  method: string;
  amount: number;
  status: "Success" | "Failed" | "Pending";
  timestamp: string;
}
