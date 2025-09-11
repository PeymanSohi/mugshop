import { useEffect, useState } from 'react';
import { Product } from '../types';

type ApiProduct = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price: number;
  sale_price?: number;
  image?: string;
};

export function useApiProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((rows: ApiProduct[]) => {
        const mapped: Product[] = rows.map(r => ({
          id: String(r.id),
          name: r.name,
          description: r.description || '',
          category: r.category || 'نامشخص',
          price: r.price,
          salePrice: r.sale_price ?? undefined,
          image: r.image || '/favicon.svg',
          inStock: true
        }));
        setProducts(mapped);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}


