import React from 'react';
import { ShoppingCart, X, ChevronLeft } from 'lucide-react';
import { CartState, CartItem } from '../types';

interface MiniCartProps {
  cart: CartState;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullCart: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ cart, isOpen, onClose, onOpenFullCart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute left-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>سبد خرید</span>
            {cart.itemCount > 0 && (
              <span className="bg-amber-700 text-white text-xs px-2 py-1 rounded-full">
                {cart.itemCount}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">سبد خرید شما خالی است</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.slice(0, 3).map((item: CartItem) => (
                <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    loading="lazy"
                    className="h-12 w-12 object-cover rounded-md"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{item.product.name}</h3>
                    <p className="text-amber-700 font-semibold text-sm">
                      {(item.product.salePrice || item.product.price).toFixed(2)} تومان
                    </p>
                    <p className="text-gray-500 text-xs">تعداد: {item.quantity}</p>
                  </div>
                </div>
              ))}
              
              {cart.items.length > 3 && (
                <div className="text-center text-gray-500 text-sm">
                  و {cart.items.length - 3} محصول دیگر...
                </div>
              )}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between text-lg font-semibold mb-3">
              <span>مبلغ کل:</span>
              <span className="text-amber-700">{cart.total.toFixed(2)} تومان</span>
            </div>
            
            <button
              onClick={() => {
                onClose();
                onOpenFullCart();
              }}
              className="w-full bg-amber-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-800 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>مشاهده سبد خرید</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniCart;
