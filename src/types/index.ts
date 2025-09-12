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
  colors?: string[]; // Optional list of available color names (fa)
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
  firstName: string;
  lastName: string;
  name: string; // Full name for backward compatibility
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  country?: string;
  createdAt: Date;
  lastLogin?: Date;
  preferences?: UserPreferences;
  addresses?: Address[];
}

export interface UserPreferences {
  language: 'fa';
  currency: 'IRR';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  title: string;
  fullName: string;
  phone: string;
  address: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  notes?: string;
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
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  inStock: boolean;
  onSale: boolean;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'popularity' | 'rating';
}