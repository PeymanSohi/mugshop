import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | '4/3' | '3/2' | '16/9' | '2/3';
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'square',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  objectFit = 'cover',
  loading = 'lazy'
}) => {
  const aspectRatioClasses = {
    'square': 'aspect-square',
    '4/3': 'aspect-4/3',
    '3/2': 'aspect-3/2',
    '16/9': 'aspect-video',
    '2/3': 'aspect-2/3'
  };

  const objectFitClasses = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding="async"
        sizes={sizes}
        className={`w-full h-full ${objectFitClasses[objectFit]} transition-transform duration-300 hover:scale-105`}
      />
    </div>
  );
};

export default ResponsiveImage;