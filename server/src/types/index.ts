import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'admin' | 'staff' | 'readonly' | 'customer';
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  addresses?: IAddress[];
}

export interface IAddress {
  _id?: string;
  type: 'home' | 'work' | 'other';
  title: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface IProduct extends Document {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  colors?: string[];
  inStock: boolean;
  stockCount?: number;
  sku?: string;
  slug?: string;
  tags?: string[];
  popularity?: number;
  averageRating?: number;
  reviewCount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview extends Document {
  _id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  _id: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: IAddress;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}