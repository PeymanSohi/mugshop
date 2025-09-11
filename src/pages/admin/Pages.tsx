export default function PagesPage() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">صفحات محتوا</h2>
        <button className="px-3 py-2 rounded bg-amber-600 text-white text-sm hover:bg-amber-700">صفحه جدید</button>
      </div>
      <div className="mt-4 space-y-3">
        {['درباره ما','سوالات متداول','قوانین و حریم خصوصی'].map((t) => (
          <div key={t} className="p-3 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-900 dark:text-white">{t}</div>
            <div className="flex gap-2">
              <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">ویرایش</button>
              <button className="px-2 py-1 rounded bg-red-600 text-white text-sm">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


