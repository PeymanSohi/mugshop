export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  category: string;
  inStock: boolean;
  createdAt?: Date;
  popularity?: number;
  salePrice?: number;
  stockCount?: number;
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popularity';

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface WishlistState {
  items: string[]; // Array of product IDs
}

export interface FilterState {
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  inStockOnly: boolean;
}