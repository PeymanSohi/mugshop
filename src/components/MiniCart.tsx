import React, { useState } from 'react';
import { ShoppingCart, X, ChevronLeft, Plus, Minus, Trash2, Truck, Gift, Tag } from 'lucide-react';
import { CartState, CartItem } from '../types';

interface MiniCartProps {
  cart: CartState;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullCart: () => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ 
  cart, 
  isOpen, 
  onClose, 
  onOpenFullCart, 
  onUpdateQuantity, 
  onRemoveItem 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 15;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cart.total);
  const shippingCost = cart.total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const finalTotal = cart.total + shippingCost - discount;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // Mock coupon validation
      const validCoupons: Record<string, number> = {
        'WELCOME10': 10,
        'SAVE20': 20,
        'MUGLOVER': 15
      };
      
      const couponDiscount = validCoupons[couponCode.toUpperCase()];
      if (couponDiscount) {
        setAppliedCoupon(couponCode.toUpperCase());
        setDiscount(Math.min(couponDiscount, cart.total * 0.2)); // Max 20% discount
        setCouponCode('');
      }
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

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
                <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg group">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    loading="lazy"
                    className="h-12 w-12 object-cover rounded-md"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{item.product.name}</h3>
                    <p className="text-primary-600 font-semibold text-sm">
                      {(item.product.salePrice || item.product.price).toFixed(2)} تومان
                    </p>
                    
                    {/* Quantity Controls */}
                    {onUpdateQuantity && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
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
          <div className="border-t p-4 space-y-4">
            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <Truck className="h-4 w-4" />
                  <span>تا ارسال رایگان {remainingForFreeShipping.toFixed(2)} تومان دیگر</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cart.total / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Coupon Code */}
            <div className="space-y-2">
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="کد تخفیف"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    dir="ltr"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center gap-1"
                  >
                    <Tag className="h-4 w-4" />
                    اعمال
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Gift className="h-4 w-4" />
                    <span>کد {appliedCoupon} اعمال شد</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    حذف
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>جمع کل:</span>
                <span>{cart.total.toFixed(2)} تومان</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>هزینه ارسال:</span>
                <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                  {shippingCost === 0 ? 'رایگان' : `${shippingCost.toFixed(2)} تومان`}
                </span>
              </div>
              
              {discount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>تخفیف:</span>
                  <span>-{discount.toFixed(2)} تومان</span>
                </div>
              )}
              
              <div className="border-t pt-2 flex items-center justify-between text-lg font-semibold">
                <span>مبلغ نهایی:</span>
                <span className="text-primary-600">{finalTotal.toFixed(2)} تومان</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                onClose();
                onOpenFullCart();
              }}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>ادامه فرایند خرید</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniCart;
