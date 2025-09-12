import { useEffect, useState } from 'react';
import { Product } from '../types';

type ApiProduct = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  salePrice?: number;
  image?: string;
  inStock?: boolean;
  stockCount?: number;
  sku?: string;
  colors?: string[];
  popularity?: number;
  isActive?: boolean;
};

type ApiResponse = {
  products: ApiProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export function useApiProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((response: ApiResponse) => {
        // Filter only active products
        const activeProducts = response.products.filter(p => p.isActive !== false);
        
        const mapped: Product[] = activeProducts.map(r => ({
          id: r._id,
          name: r.name,
          description: r.description || '',
          category: r.category || 'نامشخص',
          price: r.price,
          salePrice: r.salePrice ?? undefined,
          image: r.image || '/favicon.svg',
          inStock: r.inStock ?? true,
          stockCount: r.stockCount,
          sku: r.sku,
          colors: r.colors || [],
          popularity: r.popularity || 0
        }));
        setProducts(mapped);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}


