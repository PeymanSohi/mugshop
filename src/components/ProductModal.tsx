import React, { useState } from 'react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, product, onClose, onAddToCart }) => {
  if (!isOpen || !product) return null;

  const baseImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const imageUrls = baseImages.length >= 2 ? baseImages : [baseImages[0], baseImages[0]];
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={imageUrls[currentIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full px-3 py-1"
                >
                  ‹
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full px-3 py-1"
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
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {!product.inStock && <span className="text-sm text-red-600">ناموجود</span>}
            </div>
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className={`w-full px-4 py-3 rounded-md font-semibold transition-colors ${
                product.inStock ? 'bg-amber-700 hover:bg-amber-800 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              افزودن به سبد خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;


