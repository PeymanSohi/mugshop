import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Lock, Truck, Gift, Tag, Trash2 } from 'lucide-react';
import { CartState, CartItem, User, Product } from '../types';
import CartRecommendations from './CartRecommendations';
import { formatPersianPrice, toPersianNumbers } from '../utils/persianNumbers';

interface CartProps {
  cart: CartState;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  user: User | null;
  onLoginToggle: () => void;
  onCheckout?: () => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: (productId: string) => boolean;
  isLoading?: boolean;
  products?: Product[];
}

const Cart: React.FC<CartProps> = ({ 
  cart, 
  isOpen, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem, 
  user, 
  onLoginToggle,
  onCheckout,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  isLoading,
  products = []
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
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="cart-title" className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            <span>سبد خرید</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="بستن سبد خرید"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">سبد خرید شما خالی است</p>
              <p className="text-gray-400 text-sm mt-2">برای شروع چند ماگ اضافه کنید!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item: CartItem) => (
                <div key={item.product.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg group">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    loading="lazy"
                    decoding="async"
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.product.name}</h3>
                    <p className="text-primary-600 font-semibold">
                      {formatPersianPrice(item.product.salePrice || item.product.price)}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      مجموع: {formatPersianPrice((item.product.salePrice || item.product.price) * item.quantity)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                      aria-label={`کاهش تعداد ${item.product.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    
                    <span className="font-medium w-8 text-center" aria-label={`تعداد: ${item.quantity}`}>{toPersianNumbers(item.quantity.toString())}</span>
                    
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                      aria-label={`افزایش تعداد ${item.product.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all"
                    aria-label={`حذف ${item.product.name} از سبد خرید`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && (
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
                  <Truck className="h-4 w-4" />
                  <span>تا ارسال رایگان {formatPersianPrice(remainingForFreeShipping)} دیگر</span>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-2">
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
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
                <span>{formatPersianPrice(cart.total)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>هزینه ارسال:</span>
                <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                  {shippingCost === 0 ? 'رایگان' : formatPersianPrice(shippingCost)}
                </span>
              </div>
              
              {discount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>تخفیف:</span>
                  <span>-{formatPersianPrice(discount)}</span>
                </div>
              )}
              
              <div className="border-t pt-2 flex items-center justify-between text-lg font-semibold">
                <span>مبلغ نهایی:</span>
                <span className="text-primary-600">{formatPersianPrice(finalTotal)}</span>
              </div>
            </div>
            
            {user ? (
              <button
                onClick={() => onCheckout && onCheckout()}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                ادامه فرایند خرید
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <Lock className="h-4 w-4" />
                  <span>برای تکمیل خرید لطفاً وارد شوید</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onLoginToggle();
                  }}
                  className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  ورود برای خرید
                </button>
              </div>
            )}
          </div>
        )}

        {/* Product Recommendations */}
        {cart.items.length > 0 && onAddToCart && products.length > 0 && (
          <div className="p-6 border-t">
            <CartRecommendations
              products={products}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={isInWishlist}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;