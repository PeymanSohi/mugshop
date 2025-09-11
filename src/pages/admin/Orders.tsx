export default function OrdersPage() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">سفارش‌ها</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-gray-600 dark:text-gray-300">
            <tr>
              <th className="text-right p-2">شناسه</th>
              <th className="text-right p-2">مشتری</th>
              <th className="text-right p-2">مبلغ</th>
              <th className="text-right p-2">وضعیت</th>
              <th className="text-right p-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4].map(id => (
              <tr key={id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="p-2">#{id}</td>
                <td className="p-2">کاربر نمونه</td>
                <td className="p-2">۳۵۰,۰۰۰ تومان</td>
                <td className="p-2"><span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">در انتظار</span></td>
                <td className="p-2"><button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">جزئیات</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


