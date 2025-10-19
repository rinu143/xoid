export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrls: string[];
  description: string;
  color: string;
  material: string;
  sizeStock: { [key: string]: number };
  stock: number; // Total stock
  sizes: string[];
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
  cartItemId: string;
}

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}