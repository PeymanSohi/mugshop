import React from 'react';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Product } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResponsiveImage from './ResponsiveImage';
import { useCurrency, formatPrice } from '../hooks/useCurrency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpen: () => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
  searchTerm?: string;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onOpen, 
  onToggleWishlist, 
  isInWishlist, 
  searchTerm, 
  isLoading 
}) => {
  const { t } = useTranslation();
  const [{ currency, rates }] = useCurrency();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group"
      role="article"
      aria-labelledby={`product-${product.id}-title`}
    >
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="cursor-pointer"
          onClick={onOpen}
        >
        <ResponsiveImage
          src={product.image}
          alt={product.name}
          aspectRatio="4/3"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="transition-transform duration-300 group-hover:scale-110"
        />
        </motion.div>
        
        {!product.inStock && (
          <div 
            className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
            aria-label={t('products.outOfStock')}
          >
            <span className="text-white font-semibold text-sm sm:text-lg">{t('products.outOfStock')}</span>
          </div>
        )}
        
        {/* Stock Badge */}
        {product.inStock && product.stockCount && product.stockCount <= 5 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium"
          >
            {t('products.stockLow', { count: product.stockCount })}
          </motion.div>
        )}
        
        {/* Sale Badge */}
        {product.salePrice && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-8 right-2 sm:top-16 sm:right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium"
          >
            {t('products.sale')}
          </motion.div>
        )}
        
        {/* Rating Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white dark:bg-gray-700 rounded-full p-1.5 sm:p-2 shadow-md"
        >
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              {(product.averageRating?.toFixed(1) || '4.8')}
            </span>
          </div>
        </motion.div>
        
        {/* Wishlist Button */}
        {onToggleWishlist && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white dark:bg-gray-700 rounded-full p-1.5 sm:p-2 shadow-md hover:bg-red-50 dark:hover:bg-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isInWishlist ? t('a11y.removeFromWishlist') : t('a11y.addToWishlist')}
          >
            <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400 dark:text-gray-300'}`} />
          </motion.button>
        )}

        {/* Quick View Button */}
        <motion.button
          onClick={onOpen}
          className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white dark:bg-gray-700 rounded-full p-1.5 sm:p-2 shadow-md hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={t('products.quickView')}
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600 dark:text-primary-400" />
        </motion.button>
      </div>
      
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="mb-2">
          <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs px-2 py-1 rounded-full font-medium">
            {t(`category.${product.category.toLowerCase()}`, product.category)}
          </span>
        </div>
        
        <h3 
          id={`product-${product.id}-title`}
          className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          onClick={onOpen}
        >
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex flex-col">
            {product.salePrice ? (
              <>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-700 dark:text-primary-400">
                  {formatPrice(product.salePrice, currency, rates)}
                </div>
                <div className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.price, currency, rates)}
                </div>
              </>
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-700 dark:text-primary-400">
                {formatPrice(product.price, currency, rates)}
              </div>
            )}
            
            {/* Free Shipping Badge */}
            {(product.salePrice || product.price) >= 50 && (
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1 flex items-center gap-1">
                <span>🚚</span>
                <span>{t('products.freeShipping')}</span>
              </div>
            )}
          </div>
          
          <motion.button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={!product.inStock || isLoading}
            className={`flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              product.inStock && !isLoading
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            whileHover={product.inStock && !isLoading ? { scale: 1.05 } : {}}
            whileTap={product.inStock && !isLoading ? { scale: 0.95 } : {}}
            aria-label={`${t('products.addToCart')} ${product.name}`}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="hidden sm:inline">
              {isLoading ? t('products.adding') : t('products.addToCart')}
            </span>
            <span className="sm:hidden">
              {isLoading ? t('products.adding') : t('products.add')}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

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