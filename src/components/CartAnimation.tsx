import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  productImage?: string;
  productName?: string;
}

const CartAnimation: React.FC<CartAnimationProps> = ({
  isVisible,
  onComplete,
  productImage,
  productName
}) => {
  const [animationPhase, setAnimationPhase] = useState<'flying' | 'bounce' | 'complete'>('flying');

  useEffect(() => {
    if (!isVisible) return;

    const timer1 = setTimeout(() => {
      setAnimationPhase('bounce');
    }, 600);

    const timer2 = setTimeout(() => {
      setAnimationPhase('complete');
      onComplete();
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Flying Animation */}
      {animationPhase === 'flying' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-fly-to-cart">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-12 h-12 rounded-lg shadow-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-primary-600 rounded-lg shadow-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Bounce Animation */}
      {animationPhase === 'bounce' && (
        <div className="absolute top-4 right-4">
          <div className="animate-bounce-in">
            <div className="bg-primary-600 text-white p-2 rounded-full shadow-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {animationPhase === 'complete' && (
        <div className="absolute top-4 right-4">
          <div className="animate-fade-in bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">اضافه شد!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartAnimation;
