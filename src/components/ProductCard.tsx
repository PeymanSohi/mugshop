import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { HighlightText } from '../utils/highlightText';
import LoadingSpinner from './LoadingSpinner';

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
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] hover-lift" onClick={onOpen}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">ناموجود</span>
          </div>
        )}
        
        {/* Stock Badge */}
        {product.inStock && product.stockCount && product.stockCount <= 5 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            فقط {product.stockCount} عدد باقی‌مانده
          </div>
        )}
        
        {/* Sale Badge */}
        {product.salePrice && (
          <div className="absolute top-16 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            تخفیف
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.averageRating?.toFixed(1) || '4.8'}</span>
          </div>
        </div>
        
        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </button>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
            {product.category}
          </span>
        </div>
        
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <HighlightText text={product.name} searchTerm={searchTerm || ''} />
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              <HighlightText text={product.description} searchTerm={searchTerm || ''} />
            </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.salePrice ? (
              <>
                <div className="text-2xl font-bold text-amber-700">
                  {product.salePrice.toFixed(2)} تومان
                </div>
                <div className="text-lg text-gray-500 line-through">
                  {product.price.toFixed(2)} تومان
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-amber-700">
                {product.price.toFixed(2)} تومان
              </div>
            )}
            
            {/* Free Shipping Badge */}
            {(product.salePrice || product.price) >= 50 && (
              <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                <span>🚚</span>
                <span>ارسال رایگان</span>
              </div>
            )}
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={!product.inStock || isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              product.inStock && !isLoading
                ? 'bg-amber-700 text-white hover:bg-amber-800 hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            <span>{isLoading ? 'در حال افزودن...' : 'افزودن به سبد'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;