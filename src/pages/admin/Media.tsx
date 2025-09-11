export default function MediaPage() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">رسانه</h2>
        <button className="px-3 py-2 rounded bg-amber-600 text-white text-sm hover:bg-amber-700">آپلود تصویر</button>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  );
}


