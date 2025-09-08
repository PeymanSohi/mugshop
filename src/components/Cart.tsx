import React from 'react';
import { X, Plus, Minus, ShoppingBag, Lock } from 'lucide-react';
import { CartState, CartItem, User } from '../types';

interface CartProps {
  cart: CartState;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  user: User | null;
  onLoginToggle: () => void;
}

const Cart: React.FC<CartProps> = ({ 
  cart, 
  isOpen, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem, 
  user, 
  onLoginToggle 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span>Shopping Cart</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">Add some mugs to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item: CartItem) => (
                <div key={item.product.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-amber-700 font-semibold">${item.product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t p-6">
            <div className="flex items-center justify-between text-lg font-semibold mb-4">
              <span>Total:</span>
              <span className="text-amber-700">${cart.total.toFixed(2)}</span>
            </div>
            
            {user ? (
              <button className="w-full bg-amber-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-800 transition-colors duration-200">
                Proceed to Checkout
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm">
                  <Lock className="h-4 w-4" />
                  <span>Please login to checkout</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onLoginToggle();
                  }}
                  className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  Login to Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;