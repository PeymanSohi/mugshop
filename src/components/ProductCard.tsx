import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-amber-700">
            ${product.price.toFixed(2)}
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              product.inStock
                ? 'bg-amber-700 text-white hover:bg-amber-800 hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;