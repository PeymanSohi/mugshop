export default function CustomersPage() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">کاربران</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1,2,3,4,5,6].map(id => (
          <div key={id} className="p-4 rounded border border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-900 dark:text-white">کاربر #{id}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">example{id}@mail.com</div>
            <div className="mt-3 flex gap-2">
              <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">مشاهده</button>
              <button className="px-2 py-1 rounded bg-red-600 text-white text-sm">مسدود</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


