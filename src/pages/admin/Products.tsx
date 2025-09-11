import { useEffect, useState } from 'react';
import AdminProductModal from '../../components/AdminProductModal';

type ApiProduct = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price: number;
  sale_price?: number;
  image?: string;
};

export default function ProductsPage() {
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [active, setActive] = useState<ApiProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const saveProduct = async (p: ApiProduct) => {
    setSavingId(p.id);
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      const updated = await res.json();
      setItems(prev => prev.map(x => x.id === p.id ? updated as ApiProduct : x));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">محصولات</h2>
        <button onClick={() => { setActive({ id: 0, name: '', price: 0 }); setIsModalOpen(true); }} className="px-3 py-2 rounded bg-amber-600 text-white text-sm hover:bg-amber-700">افزودن محصول</button>
      </div>
      {loading && <div className="mt-4 text-sm text-gray-500">در حال بارگذاری...</div>}
      <div className="mt-4 grid grid-cols-1 gap-3">
        {items.map(p => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img src={p.image || '/favicon.svg'} alt={p.name} className="w-12 h-12 rounded object-cover" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">دسته: {p.category || '—'}</div>
              </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
              {p.sale_price ? (
                <>
                  <span className="line-through mr-2 text-gray-400">{p.price.toLocaleString('fa-IR')} تومان</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{p.sale_price.toLocaleString('fa-IR')} تومان</span>
                </>
              ) : (
                <span className="font-semibold">{p.price.toLocaleString('fa-IR')} تومان</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setActive(p); setIsModalOpen(true); }} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">ویرایش</button>
              <button className="px-2 py-1 rounded bg-red-600 text-white text-sm">حذف</button>
            </div>
          </div>
        ))}
      </div>
      <AdminProductModal
        isOpen={isModalOpen}
        product={active}
        onClose={() => setIsModalOpen(false)}
        onSave={async (p) => {
          if (p.id === 0) return; // creation not wired yet
          await saveProduct(p);
        }}
      />
    </div>
  );
}


