export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'customer';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for cart (product.id + size + color)
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}