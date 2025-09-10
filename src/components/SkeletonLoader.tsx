import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded';
      case 'card':
        return 'rounded-lg';
      default:
        return 'rounded';
    }
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '200px')
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-4 space-y-4">
    <SkeletonLoader variant="rectangular" height="200px" />
    <div className="space-y-2">
      <SkeletonLoader variant="text" width="60%" />
      <SkeletonLoader variant="text" lines={2} />
      <div className="flex justify-between items-center">
        <SkeletonLoader variant="text" width="80px" />
        <SkeletonLoader variant="rectangular" width="100px" height="36px" />
      </div>
    </div>
  </div>
);

// Cart Item Skeleton
export const CartItemSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
    <SkeletonLoader variant="rectangular" width="64px" height="64px" />
    <div className="flex-1 space-y-2">
      <SkeletonLoader variant="text" width="70%" />
      <SkeletonLoader variant="text" width="40%" />
    </div>
    <div className="flex items-center gap-2">
      <SkeletonLoader variant="rectangular" width="32px" height="32px" />
      <SkeletonLoader variant="text" width="20px" />
      <SkeletonLoader variant="rectangular" width="32px" height="32px" />
    </div>
  </div>
);

export default SkeletonLoader;