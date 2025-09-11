export default function AnalyticsPage() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">آنالیتیکس</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {['فروش امروز','میانگین سبد','نرخ تبدیل'].map((t, i) => (
          <div key={i} className="p-4 rounded border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t}</div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">—</div>
          </div>
        ))}
      </div>
      <div className="mt-6 h-48 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700" />
    </div>
  );
}


