import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Heart, Star } from 'lucide-react';
import { useApiProducts } from '../hooks/useApiProducts';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { usePinchZoom } from '../hooks/usePinchZoom';
import LoadingSpinner from '../components/LoadingSpinner';
import Reviews from '../components/Reviews';

const ProductPage: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist, isLoading } = useAppContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const { zoomState, setupPinchZoom, resetZoom } = usePinchZoom();
  
  // Load products from API
  const { products, loading: productsLoading } = useApiProducts();

  const product = useMemo(() => {
    return products.find(p => p.id === id);
  }, [id, products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">محصول یافت نشد</h1>
          <p className="text-gray-600 mb-8">محصول مورد نظر شما وجود ندارد یا حذف شده است.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  const allMugImages = ['/mugs/image.jpeg', '/mugs/image-2.jpeg', '/mugs/image-3.jpeg'];
  const baseImages = (product.images && product.images.length > 0 ? product.images : [product.image]).filter(Boolean);
  const randomizedExtras = useMemo(() => {
    const pool = allMugImages.filter((src) => !baseImages.includes(src));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, [product.id]);
  const composed = [...baseImages, ...randomizedExtras];
  const imageUrls = composed.length >= 2 ? composed : [composed[0], composed[0]];

  const goPrev = () => setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  const goNext = () => setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (imageUrls.length <= 1) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          goNext(); // In RTL, left arrow goes to next image
          break;
        case 'ArrowRight':
          goPrev(); // In RTL, right arrow goes to previous image
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageUrls.length]);

  // Setup pinch zoom
  useEffect(() => {
    const cleanup = setupPinchZoom(imageRef.current);
    return cleanup;
  }, [setupPinchZoom]);

  // Reset zoom when image changes
  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              صفحه اصلی
            </button>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">{product.category}</span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
              <img
                ref={imageRef}
                src={imageUrls[currentImageIndex]}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-200"
                style={{
                  transform: `scale(${zoomState.scale}) translate(${zoomState.translateX}px, ${zoomState.translateY}px)`,
                  transformOrigin: 'center center'
                }}
              />
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full px-3 py-1"
                  >
                    ‹
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full px-3 py-1"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {imageUrls.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border ${
                      idx === currentImageIndex ? 'border-amber-700' : 'border-transparent'
                    }`}
                  >
                    <img src={src} alt={`thumb-${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full font-medium">
                  {product.category}
                </span>
                {!product.inStock && (
                  <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium">
                    ناموجود
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              
            </div>

            <div className="text-3xl font-bold text-amber-700">
              {product.salePrice ? (
                <div className="flex items-center gap-3">
                  <span>{product.salePrice.toFixed(2)} تومان</span>
                  <span className="text-xl text-gray-500 line-through">{product.price.toFixed(2)} تومان</span>
                </div>
              ) : (
                <span>{product.price.toFixed(2)} تومان</span>
              )}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">ویژگی‌ها:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  جنس: سرامیک باکیفیت
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  گنجایش تقریبی: ۳۰۰ تا ۳۵۰ میلی‌لیتر
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  قابل شست‌وشو در ماشین ظرف‌شویی
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  قابل استفاده در مایکروویو
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">تعداد:</span>
              <div className="inline-flex items-center rounded-md border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-16 text-center outline-none py-2"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock || isLoading}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  product.inStock && !isLoading
                    ? 'bg-amber-700 hover:bg-amber-800 text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
                {isLoading ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
              </button>
              
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-lg border transition-colors ${
                  isInWishlist(product.id)
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ProductPage;
