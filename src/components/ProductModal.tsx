import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import Reviews from './Reviews';
import { usePinchZoom } from '../hooks/usePinchZoom';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToCartWithQuantity?: (product: Product, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, product, onClose, onAddToCart, onAddToCartWithQuantity }) => {
  if (!isOpen || !product) return null;

  const allMugImages = ['/mugs/image.jpeg', '/mugs/image-2.jpeg', '/mugs/image-3.jpeg'];
  const baseImages = (product.images && product.images.length > 0 ? product.images : [product.image]).filter(Boolean);
  const randomizedExtras = useMemo(() => {
    const pool = allMugImages.filter((src) => !baseImages.includes(src));
    // pick up to 2 random extras
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, [product.id]);
  const composed = [...baseImages, ...randomizedExtras];
  const imageUrls = composed.length >= 2 ? composed : [composed[0], composed[0]];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviews, setShowReviews] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { zoomState, setupPinchZoom, resetZoom } = usePinchZoom();
  const focusTrapRef = useFocusTrap(isOpen);

  const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      if (onAddToCartWithQuantity) {
        await onAddToCartWithQuantity(product, quantity);
      } else {
        await onAddToCart(product);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          goNext(); // In RTL, left arrow goes to next image
          break;
        case 'ArrowRight':
          goPrev(); // In RTL, right arrow goes to previous image
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Setup pinch zoom
  useEffect(() => {
    if (!isOpen) return;
    const cleanup = setupPinchZoom(imageRef.current);
    return cleanup;
  }, [isOpen, setupPinchZoom]);

  // Reset zoom when image changes
  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        ref={focusTrapRef as React.RefObject<HTMLDivElement>}
        className="bg-white dark:bg-gray-800 w-full max-w-4xl lg:max-w-6xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col mx-4 sm:mx-0"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full p-2 transition-colors"
            aria-label="بستن پنجره محصول"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1 min-h-0">
          <div className="relative aspect-square sm:aspect-square w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 group">
            <img
              ref={imageRef}
              src={imageUrls[currentIndex]}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              style={{
                transform: `scale(${zoomState.scale}) translate(${zoomState.translateX}px, ${zoomState.translateY}px)`,
                transformOrigin: 'center center'
              }}
            />
            
            {/* Image counter */}
            {imageUrls.length > 1 && (
              <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                {currentIndex + 1} / {imageUrls.length}
              </div>
            )}
            
            {/* Zoom hint overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-white bg-opacity-90 text-gray-800 text-xs px-3 py-2 rounded-lg shadow-lg">
                برای زوم کردن دو انگشت را روی تصویر قرار دهید
              </div>
            </div>
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 rtl:left-2 rtl:right-auto opacity-0 group-hover:opacity-100"
                  aria-label="تصویر قبلی"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goNext}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 rtl:right-2 rtl:left-auto opacity-0 group-hover:opacity-100"
                  aria-label="تصویر بعدی"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {imageUrls.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        idx === currentIndex 
                          ? 'bg-amber-700 w-6' 
                          : 'bg-white/70 hover:bg-white/90'
                      }`}
                      aria-label={`تصویر ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Image Thumbnails - moved here */}
            {imageUrls.length > 1 && (
              <div className="mt-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="تصاویر محصول">
                  {imageUrls.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-110 group ${
                        idx === currentIndex 
                          ? 'border-amber-700 shadow-lg ring-2 ring-amber-200 dark:ring-amber-800 scale-105' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-amber-400 hover:shadow-md'
                      }`}
                      role="tab"
                      aria-selected={idx === currentIndex}
                      aria-label={`تصویر ${idx + 1}`}
                    >
                      <img 
                        src={src} 
                        alt={`تصویر ${idx + 1} از ${product.name}`} 
                        loading="lazy" 
                        decoding="async" 
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110" 
                      />
                      {idx === currentIndex && (
                        <div className="absolute inset-0 bg-amber-700 bg-opacity-30 flex items-center justify-center">
                          <svg className="w-3 h-3 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Product Rating - Clickable to show reviews */}
            <button 
              onClick={() => setShowReviews(!showReviews)}
              className={`flex items-center justify-between w-full text-right p-3 rounded-lg transition-all duration-200 border ${
                showReviews 
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">({product.averageRating?.toFixed(1) || '4.8'})</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{product.reviewCount || 24} نظر</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {showReviews ? 'مخفی کردن نظرات' : 'مشاهده نظرات'}
                </span>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showReviews ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Product Description */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">توضیحات محصول</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">مشخصات فنی</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">جنس: سرامیک باکیفیت</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">گنجایش: ۳۰۰-۳۵۰ میلی‌لیتر</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">قابل شست‌وشو در ماشین ظرف‌شویی</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">قابل استفاده در مایکروویو</span>
                </div>
              </div>
            </div>
            {/* Price Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {product.salePrice ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-amber-700 dark:text-amber-400">{product.salePrice.toFixed(2)} تومان</span>
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">تخفیف</span>
                      </div>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">{product.price.toFixed(2)} تومان</span>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {Math.round(((product.price - product.salePrice) / product.price) * 100)}% صرفه‌جویی
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-amber-700 dark:text-amber-400">{product.price.toFixed(2)} تومان</span>
                  )}
                </div>
                <div className="text-right">
                  {product.inStock ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">موجود</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">ناموجود</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label htmlFor="quantity-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">تعداد:</label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="کاهش تعداد"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    id="quantity-input"
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                    className="w-12 text-center outline-none py-2 bg-transparent text-gray-900 dark:text-white font-medium focus:bg-gray-50 dark:focus:bg-gray-600"
                    aria-label="تعداد محصول"
                  />
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    disabled={quantity >= 99}
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="افزایش تعداد"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {quantity === 99 ? 'حداکثر' : `حداکثر ۹۹ عدد`}
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className={`w-full px-4 py-3 rounded-lg font-bold text-base transition-all duration-200 transform hover:scale-105 relative overflow-hidden ${
                  addedToCart
                    ? 'bg-green-600 text-white shadow-lg'
                    : product.inStock && !isAddingToCart
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
                aria-label={`افزودن ${quantity} عدد ${product.name} به سبد خرید`}
              >
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>در حال افزودن...</span>
                    </>
                  ) : addedToCart ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>افزوده شد!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      {product.inStock ? `افزودن ${quantity} عدد به سبد خرید` : 'ناموجود'}
                    </>
                  )}
                </div>
                
                {/* Success animation overlay */}
                {addedToCart && (
                  <div className="absolute inset-0 bg-green-500 animate-pulse opacity-20"></div>
                )}
              </button>
              
              {/* Additional Info */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>ارسال سریع</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>ضمانت کیفیت</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>محبوب مشتریان</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Collapsible Reviews Section - Outside main content */}
      {showReviews && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="px-6 py-4 max-h-[40vh] overflow-y-auto scrollbar-hide">
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              <Reviews
                reviews={product.reviews || []}
                averageRating={product.averageRating || 0}
                reviewCount={product.reviewCount || 0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModal;


