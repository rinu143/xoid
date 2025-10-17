export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrls: string[];
  tshirtOnlyImageUrl: string;
  description: string;
  aiPromptDescription: string;
  color: string;
  material: string;
  stock: number;
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
