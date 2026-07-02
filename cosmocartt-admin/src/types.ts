export interface Product {
  _id?: string;

  name: string;
  brand: string;
  model: string;

  category: string;
  subcategory: string;
  description?: string;
  sku: string;

  hsnCode?: string;
  gstPercentage?: number;

  costPrice: number;
  wholesalePrice: number;
  retailPrice: number;

  stock: number;

  image?: string;
  images?: string[];

  status: string;
  approvalStatus?: string;

  faqs?: {
    question: string;
    answer: string;
  }[];
}