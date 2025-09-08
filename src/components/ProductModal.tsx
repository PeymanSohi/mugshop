import React, { useMemo, useState } from 'react';
import { Product } from '../types';

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

  const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
            <img
              src={imageUrls[currentIndex]}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full px-3 py-1 rtl:left-2 rtl:right-auto"
                >
                  ‹
                </button>
                <button
                  onClick={goNext}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full px-3 py-1 rtl:right-2 rtl:left-auto"
                >
                  ›
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {imageUrls.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-2 w-2 rounded-full ${idx === currentIndex ? 'bg-amber-700' : 'bg-white/70'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>
            <ul className="mb-6 space-y-2 text-sm text-gray-600">
              <li>جنس: سرامیک باکیفیت</li>
              <li>گنجایش تقریبی: ۳۰۰ تا ۳۵۰ میلی‌لیتر</li>
              <li>قابل شست‌وشو در ماشین ظرف‌شویی</li>
              <li>قابل استفاده در مایکروویو</li>
            </ul>
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold text-gray-900">{product.price.toFixed(2)} تومان</span>
              {!product.inStock && <span className="text-sm text-red-600">ناموجود</span>}
            </div>

            <div className="flex items-center gap-3 mb-4">
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
                  className="w-14 text-center outline-none py-2"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => (onAddToCartWithQuantity ? onAddToCartWithQuantity(product, quantity) : onAddToCart(product))}
              disabled={!product.inStock}
              className={`w-full px-4 py-3 rounded-md font-semibold transition-colors ${
                product.inStock ? 'bg-amber-700 hover:bg-amber-800 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              افزودن به سبد خرید
            </button>
          </div>
        </div>

        {imageUrls.length > 1 && (
          <div className="px-6 pb-6">
            <div className="flex gap-3 overflow-x-auto">
              {imageUrls.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border ${idx === currentIndex ? 'border-amber-700' : 'border-transparent'}`}
                >
                  <img src={src} alt={`thumb-${idx}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;


