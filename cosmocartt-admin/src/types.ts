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

export interface Product {
  _id?: string;

  name: string;
  brand: string;

  category: string;
  subcategory: string;
  description?: string;
  sku: string;

  costPrice: number;
  wholesalePrice: number;
  retailPrice: number;

  stock: number;

  image: string;

  status: string;
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
  _id: string;

  orderNumber?: string;

  customerName: string;

  email: string;

  totalAmount: number;

  shipmentId?: string;

  shiprocketOrderId?: string;

  awbCode?: string;

  courierName?: string;

  trackingUrl?: string;

  shippingStatus?: string;

  paymentStatus?: string;

  status:
  | "Order Placed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

  createdAt: string;

  products: {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
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
