export default function ReviewsPage() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">نظرات</h2>
      <div className="mt-4 space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="p-3 rounded border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-800 dark:text-gray-100">نظر نمونه #{i}</div>
            <div className="mt-2 flex gap-2">
              <button className="px-2 py-1 rounded bg-green-600 text-white text-sm">تایید</button>
              <button className="px-2 py-1 rounded bg-red-600 text-white text-sm">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


