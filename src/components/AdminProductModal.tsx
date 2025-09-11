import { useEffect, useState } from 'react';

type ModalProduct = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price: number;
  sale_price?: number;
  image?: string;
};

export default function AdminProductModal({
  isOpen,
  product,
  onClose,
  onSave
}: {
  isOpen: boolean;
  product: ModalProduct | null;
  onClose: () => void;
  onSave: (p: ModalProduct) => void;
}) {
  const [draft, setDraft] = useState<ModalProduct | null>(product);

  useEffect(() => {
    setDraft(product);
  }, [product]);

  if (!isOpen || !draft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ویرایش محصول</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">✕</button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <img src={draft.image || '/favicon.svg'} className="w-16 h-16 rounded object-cover" />
            <div className="flex-1 space-y-2">
              <input
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                value={draft.image || ''}
                placeholder="آدرس تصویر (در صورت نیاز)"
                onChange={(e) => setDraft({ ...draft, image: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const body = new FormData();
                  body.append('file', file);
                  const res = await fetch('/api/upload', { method: 'POST', body });
                  const data = await res.json();
                  if (data.url) setDraft({ ...draft, image: data.url.replace('/api', '') });
                }}
                className="block w-full text-sm text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">نام</label>
              <input className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">دسته</label>
              <input className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm" value={draft.category || ''} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">قیمت</label>
              <input type="number" className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value || 0) })} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">قیمت با تخفیف</label>
              <input type="number" placeholder="—" className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm" value={draft.sale_price ?? ''} onChange={(e) => setDraft({ ...draft, sale_price: e.target.value === '' ? undefined : Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">توضیحات</label>
            <textarea rows={4} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm" value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100">انصراف</button>
          <button onClick={() => { onSave(draft); onClose(); }} className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white text-sm">ذخیره</button>
        </div>
      </div>
    </div>
  );
}


