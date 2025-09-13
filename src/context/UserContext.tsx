import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Order, Address } from '../types';

interface UserContextType {
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginField: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    country?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    firstName: 'کاربر',
    lastName: 'نمونه',
    name: 'کاربر نمونه',
    phone: '09123456789',
    country: 'IR',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    preferences: {
      language: 'fa',
      currency: 'IRR',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      theme: 'auto'
    },
    addresses: [
      {
        id: 'addr1',
        type: 'home',
        title: 'خانه',
        fullName: 'کاربر نمونه',
        phone: '09123456789',
        address: 'خیابان ولیعصر، پلاک ۱۲۳',
        street: 'خیابان ولیعصر، پلاک ۱۲۳',
        city: 'تهران',
        province: 'تهران',
        postalCode: '1234567890',
        isDefault: true
      }
    ]
  }
];

const mockOrders: Order[] = [
  {
    id: 'order1',
    userId: '1',
    items: [
      {
        product: {
          id: '1',
          name: 'ماگ سفید کلاسیک',
          price: 25.00,
          image: '/mugs/image.jpeg',
          description: 'ماگ سفید ساده و زیبا',
          category: 'کلاسیک',
          inStock: true
        },
        quantity: 2
      }
    ],
    total: 50.00,
    status: 'delivered',
    shippingAddress: {
      id: 'addr1',
      type: 'home',
      title: 'خانه',
      fullName: 'کاربر نمونه',
      phone: '09123456789',
      address: 'خیابان ولیعصر، پلاک ۱۲۳',
      city: 'تهران',
      province: 'تهران',
      postalCode: '1234567890',
      isDefault: true
    },
    paymentMethod: 'online',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    trackingNumber: 'TRK123456789'
  }
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    const storedOrders = localStorage.getItem('userOrders');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        userData.createdAt = new Date(userData.createdAt);
        userData.lastLogin = userData.lastLogin ? new Date(userData.lastLogin) : undefined;
        if (userData.addresses) {
          userData.addresses = userData.addresses.map((addr: any) => ({
            ...addr,
            // No date conversion needed for addresses
          }));
        }
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    
    if (storedOrders) {
      try {
        const ordersData = JSON.parse(storedOrders);
        // Convert date strings back to Date objects
        const parsedOrders = ordersData.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt)
        }));
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Error parsing stored orders data:', error);
        localStorage.removeItem('userOrders');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (loginField: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginField, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در ورود');
      }

      const data = await response.json();
      
      // Store token
      localStorage.setItem('auth_token', data.token);
      
      // Convert API user to frontend User type
      const user: User = {
        id: data.user._id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        name: data.user.name,
        phone: data.user.phone,
        avatar: data.user.avatar,
        dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth) : undefined,
        gender: data.user.gender,
        country: data.user.country,
        createdAt: new Date(data.user.createdAt),
        lastLogin: new Date(),
        preferences: {
          language: 'fa',
          currency: 'IRR',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          theme: 'auto'
        },
        addresses: data.user.addresses || []
      };
      
      setUser(user);
      setOrders([]); // Orders will be loaded separately if needed
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userOrders', JSON.stringify([]));
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    country?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
  }): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          country: userData.country,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در ثبت‌نام');
      }

      const data = await response.json();
      
      // Store token
      localStorage.setItem('auth_token', data.token);
      
      // Convert API user to frontend User type
      const user: User = {
        id: data.user._id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        name: data.user.name,
        phone: data.user.phone,
        avatar: data.user.avatar,
        dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth) : undefined,
        gender: data.user.gender,
        country: data.user.country,
        createdAt: new Date(data.user.createdAt),
        lastLogin: new Date(),
        preferences: {
          language: 'fa',
          currency: 'IRR',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          theme: 'auto'
        },
        addresses: data.user.addresses || []
      };
      
      setUser(user);
      setOrders([]);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userOrders', JSON.stringify([]));
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem('user');
    localStorage.removeItem('userOrders');
    localStorage.removeItem('auth_token');
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در به‌روزرسانی پروفایل');
      }

      const data = await response.json();
      
      // Update user with new data
      const updatedUser: User = {
        ...user,
        ...userData,
        firstName: data.user.firstName || user.firstName,
        lastName: data.user.lastName || user.lastName,
        name: data.user.name || user.name,
        email: data.user.email || user.email,
        phone: data.user.phone || user.phone,
        avatar: data.user.avatar || user.avatar,
        dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth) : user.dateOfBirth,
        gender: data.user.gender || user.gender,
        country: data.user.country || user.country,
        addresses: data.user.addresses || user.addresses
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAddress: Address = {
      ...address,
      id: Date.now().toString()
    };
    
    const updatedUser = {
      ...user,
      addresses: [...(user.addresses || []), newAddress]
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setIsLoading(false);
  };

  const updateAddress = async (addressId: string, addressData: Partial<Address>): Promise<void> => {
    if (!user || !user.addresses) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedAddresses = user.addresses.map(addr =>
      addr.id === addressId ? { ...addr, ...addressData } : addr
    );
    
    const updatedUser = {
      ...user,
      addresses: updatedAddresses
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setIsLoading(false);
  };

  const deleteAddress = async (addressId: string): Promise<void> => {
    if (!user || !user.addresses) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
    
    const updatedUser = {
      ...user,
      addresses: updatedAddresses
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setIsLoading(false);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}`,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
  };

  const value: UserContextType = {
    user,
    orders,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    createOrder
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
