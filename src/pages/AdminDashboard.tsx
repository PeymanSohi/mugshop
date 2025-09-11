import { clearSession } from '../utils/adminAuth';

export default function AdminDashboard() {
  const stats = [
    { label: 'محصولات', value: 12, trend: '+2', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' },
    { label: 'سفارش‌ها', value: 5, trend: '+1', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' },
    { label: 'کاربران', value: 38, trend: '+3', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' },
    { label: 'نظرات', value: 21, trend: '+4', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200' },
  ];

  const sections = [
    { title: 'مدیریت محصولات', desc: 'افزودن، ویرایش و حذف محصولات', action: 'ورود به بخش' },
    { title: 'مدیریت سفارش‌ها', desc: 'مشاهده و پردازش سفارش‌های مشتریان', action: 'ورود به بخش' },
    { title: 'مدیریت کاربران', desc: 'مدیریت نقش‌ها و دسترسی‌ها', action: 'ورود به بخش' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">داشبورد مدیریت</h1>
          <button
            onClick={() => { clearSession(); location.reload(); }}
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            خروج
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{s.label}</span>
                <span className={`text-xs rounded-full px-2 py-0.5 ${s.color}`}>{s.trend}</span>
              </div>
              <div className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((sec) => (
            <div key={sec.title} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{sec.title}</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{sec.desc}</p>
              <button className="mt-4 w-full rounded bg-amber-600 hover:bg-amber-700 text-white py-2 text-sm">
                {sec.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


