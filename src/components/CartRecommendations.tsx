import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatPersianPrice } from '../utils/persianNumbers';

interface CartRecommendationsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: (productId: string) => boolean;
  isLoading?: boolean;
}

const CartRecommendations: React.FC<CartRecommendationsProps> = ({
  products,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  isLoading
}) => {
  // Get 4 random products for recommendations
  const recommendedProducts = products
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if (recommendedProducts.length === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        محصولات پیشنهادی
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {recommendedProducts.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
            <div className="aspect-square mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
              />
            </div>
            
            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
              {product.name}
            </h4>
            
            <div className="flex items-center justify-between mb-2">
              <div className="text-primary-600 font-semibold text-sm">
                {formatPersianPrice(product.salePrice || product.price)}
              </div>
              
              {onToggleWishlist && (
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-1 rounded-full transition-colors ${
                    isInWishlist?.(product.id)
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist?.(product.id) ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
            
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock || isLoading}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                product.inStock && !isLoading
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-3 w-3" />
              <span>{isLoading ? 'افزودن...' : 'افزودن'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartRecommendations;
