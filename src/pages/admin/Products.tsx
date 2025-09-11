export default function ProductsPage() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">محصولات</h2>
        <button className="px-3 py-2 rounded bg-amber-600 text-white text-sm hover:bg-amber-700">افزودن محصول</button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex items-center justify-between p-3 rounded border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">محصول #{i}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">دسته: ماگ</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">ویرایش</button>
              <button className="px-2 py-1 rounded bg-red-600 text-white text-sm">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


