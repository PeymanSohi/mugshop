import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { HighlightText } from '../utils/highlightText';
import LoadingSpinner from './LoadingSpinner';
import ResponsiveImage from './ResponsiveImage';
import { formatPersianPrice, toPersianNumbers } from '../utils/persianNumbers';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpen: () => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
  searchTerm?: string;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onOpen, onToggleWishlist, isInWishlist, searchTerm, isLoading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.02] hover-lift cursor-pointer" onClick={onOpen}>
      <div className="relative">
        <ResponsiveImage
          src={product.image}
          alt={product.name}
          aspectRatio="4/3"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="transition-transform duration-300 hover:scale-110"
        />
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm sm:text-lg">ناموجود</span>
          </div>
        )}
        
        {/* Stock Badge */}
        {product.inStock && product.stockCount && product.stockCount <= 5 && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            فقط {toPersianNumbers(product.stockCount.toString())} عدد باقی‌مانده
          </div>
        )}
        
        {/* Sale Badge */}
        {product.salePrice && (
          <div className="absolute top-8 right-2 sm:top-16 sm:right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            تخفیف
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white dark:bg-gray-700 rounded-full p-1.5 sm:p-2 shadow-md">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{toPersianNumbers((product.averageRating?.toFixed(1) || '4.8'))}</span>
          </div>
        </div>
        
        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white dark:bg-gray-700 rounded-full p-1.5 sm:p-2 shadow-md hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
          >
            <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400 dark:text-gray-300'}`} />
          </button>
        )}
      </div>
      
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="mb-2">
          <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs px-2 py-1 rounded-full font-medium">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          <HighlightText text={product.name} searchTerm={searchTerm || ''} />
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          <HighlightText text={product.description} searchTerm={searchTerm || ''} />
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex flex-col">
            {product.salePrice ? (
              <>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-700 dark:text-primary-400">
                  {formatPersianPrice(product.salePrice)}
                </div>
                <div className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 line-through">
                  {formatPersianPrice(product.price)}
                </div>
              </>
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-700 dark:text-primary-400">
                {formatPersianPrice(product.price)}
              </div>
            )}
            
            {/* Free Shipping Badge */}
            {(product.salePrice || product.price) >= 50 && (
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1 flex items-center gap-1">
                <span>🚚</span>
                <span>ارسال رایگان</span>
              </div>
            )}
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={!product.inStock || isLoading}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm min-h-[44px] ${
              product.inStock && !isLoading
                ? 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="hidden sm:inline">{isLoading ? 'در حال افزودن...' : 'افزودن به سبد'}</span>
            <span className="sm:hidden">{isLoading ? 'افزودن...' : 'افزودن'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;