export default function DiscountsPage() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">تخفیف‌ها</h2>
        <button className="px-3 py-2 rounded bg-amber-600 text-white text-sm hover:bg-amber-700">ساخت کوپن</button>
      </div>
      <div className="mt-4 space-y-3">
        {[1,2].map(i => (
          <div key={i} className="p-3 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">COUPON{i}0</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">٪۱۰ - تا سقف ۵۰،۰۰۰</div>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">ویرایش</button>
              <button className="px-2 py-1 rounded bg-red-600 text-white text-sm">غیرفعال</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


