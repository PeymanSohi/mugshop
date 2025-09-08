import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartState, CartItem, AuthState, WishlistState } from '../types';
import { useToast } from './ToastContext';

interface AppContextType {
  cart: CartState;
  setCart: React.Dispatch<React.SetStateAction<CartState>>;
  wishlist: WishlistState;
  setWishlist: React.Dispatch<React.SetStateAction<WishlistState>>;
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  addToCart: (product: Product) => Promise<void>;
  addToCartWithQuantity: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Load cart from localStorage on component mount
  const [cart, setCart] = useState<CartState>(() => {
    const savedCart = localStorage.getItem('mugshop-cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
    return {
      items: [],
      total: 0,
      itemCount: 0
    };
  });

  // Wishlist state with localStorage persistence
  const [wishlist, setWishlist] = useState<WishlistState>(() => {
    const savedWishlist = localStorage.getItem('mugshop-wishlist');
    if (savedWishlist) {
      try {
        return JSON.parse(savedWishlist);
      } catch (error) {
        console.error('Error parsing saved wishlist:', error);
      }
    }
    return { items: [] };
  });

  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mugshop-cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mugshop-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = async (product: Product) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCart(prevCart => {
        const existingItem = prevCart.items.find(item => item.product.id === product.id);
        
        let newItems: CartItem[];
        if (existingItem) {
          newItems = prevCart.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...prevCart.items, { product, quantity: 1 }];
        }

        const total = newItems.reduce((sum, item) => sum + ((item.product.salePrice || item.product.price) * item.quantity), 0);
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

        return { items: newItems, total, itemCount };
      });
      
      addToast({
        type: 'success',
        title: 'محصول به سبد خرید اضافه شد',
        message: `${product.name} با موفقیت به سبد خرید شما اضافه شد.`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'خطا در افزودن محصول',
        message: 'متأسفانه خطایی در افزودن محصول به سبد خرید رخ داد.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCartWithQuantity = async (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCart(prevCart => {
        const existingItem = prevCart.items.find(item => item.product.id === product.id);
        let newItems: CartItem[];
        if (existingItem) {
          newItems = prevCart.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...prevCart.items, { product, quantity }];
        }
        const total = newItems.reduce((sum, item) => sum + ((item.product.salePrice || item.product.price) * item.quantity), 0);
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        return { items: newItems, total, itemCount };
      });
      
      addToast({
        type: 'success',
        title: 'محصولات به سبد خرید اضافه شدند',
        message: `${quantity} عدد ${product.name} با موفقیت به سبد خرید شما اضافه شد.`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'خطا در افزودن محصولات',
        message: 'متأسفانه خطایی در افزودن محصولات به سبد خرید رخ داد.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + ((item.product.salePrice || item.product.price) * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.product.id !== productId);
      const total = newItems.reduce((sum, item) => sum + ((item.product.salePrice || item.product.price) * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    });
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prevWishlist => {
      const isInWishlist = prevWishlist.items.includes(product.id);
      if (isInWishlist) {
        return {
          items: prevWishlist.items.filter(id => id !== product.id)
        };
      } else {
        return {
          items: [...prevWishlist.items, product.id]
        };
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.items.includes(productId);
  };

  const value: AppContextType = {
    cart,
    setCart,
    wishlist,
    setWishlist,
    auth,
    setAuth,
    addToCart,
    addToCartWithQuantity,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    isInWishlist,
    isLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
