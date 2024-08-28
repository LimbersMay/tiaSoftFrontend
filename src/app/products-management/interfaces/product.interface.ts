export interface Product {
  productId: string;
  name: string;
  price: number;
  isAvailable: boolean;
  description?: string;
  imageUrl?: string;
  category: string;
  categoryId: string;
}
