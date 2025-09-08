import React from 'react';
import { Heart, X } from 'lucide-react';
import { Product, WishlistState } from '../types';

interface WishlistProps {
  wishlist: WishlistState;
  products: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
}

const Wishlist: React.FC<WishlistProps> = ({
  wishlist,
  products,
  onRemoveFromWishlist,
  onAddToCart,
  onOpenProduct
}) => {
  const wishlistProducts = products.filter(product => wishlist.items.includes(product.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">لیست علاقه‌مندی‌های شما خالی است</p>
        <p className="text-gray-400 text-sm mt-2">محصولات مورد علاقه خود را اینجا ذخیره کنید</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer" onClick={() => onOpenProduct(product)}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromWishlist(product.id);
              }}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
            >
              <Heart className="h-4 w-4 text-red-500 fill-current" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-2">
              <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                {product.category}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer" onClick={() => onOpenProduct(product)}>
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-amber-700">
                {(product.salePrice || product.price).toFixed(2)} تومان
              </div>
              
              <button
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  product.inStock
                    ? 'bg-amber-700 text-white hover:bg-amber-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                افزودن به سبد
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
