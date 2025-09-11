export default function SEOPage() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEO</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-900 dark:text-white">عنوان پیش‌فرض</div>
          <input className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm" />
        </div>
        <div className="p-4 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-900 dark:text-white">توضیحات پیش‌فرض</div>
          <textarea className="mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm" rows={3} />
        </div>
      </div>
      <button className="px-3 py-2 rounded bg-amber-600 text-white text-sm hover:bg-amber-700">ذخیره</button>
    </div>
  );
}


