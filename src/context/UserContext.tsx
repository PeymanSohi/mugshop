import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Order, Address } from '../types';

interface UserContextType {
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  deleteAddress: (addressId: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'کاربر نمونه',
    phone: '09123456789',
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

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data (in real app, this would be an API call)
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') { // Simple password check for demo
      const userWithUpdatedLogin = {
        ...foundUser,
        lastLogin: new Date()
      };
      
      setUser(userWithUpdatedLogin);
      setOrders(mockOrders.filter(order => order.userId === foundUser.id));
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userWithUpdatedLogin));
      localStorage.setItem('userOrders', JSON.stringify(mockOrders.filter(order => order.userId === foundUser.id)));
    } else {
      throw new Error('ایمیل یا رمز عبور اشتباه است');
    }
    
    setIsLoading(false);
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
  }): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('کاربری با این ایمیل قبلاً ثبت‌نام کرده است');
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      createdAt: new Date(),
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
      addresses: []
    };
    
    setUser(newUser);
    setOrders([]);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('userOrders', JSON.stringify([]));
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem('user');
    localStorage.removeItem('userOrders');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (!user) return;
    
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
  };

  const updateAddress = (addressId: string, addressData: Partial<Address>) => {
    if (!user || !user.addresses) return;
    
    const updatedAddresses = user.addresses.map(addr =>
      addr.id === addressId ? { ...addr, ...addressData } : addr
    );
    
    const updatedUser = {
      ...user,
      addresses: updatedAddresses
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const deleteAddress = (addressId: string) => {
    if (!user || !user.addresses) return;
    
    const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
    
    const updatedUser = {
      ...user,
      addresses: updatedAddresses
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
