import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearSession, isAuthenticated } from '../utils/adminAuth';
import { getAdminPrefix } from '../utils/adminPrefix';
import { useEffect } from 'react';

const navItems = [
  { to: '', label: 'داشبورد' },
  { to: 'products', label: 'محصولات' },
  { to: 'orders', label: 'سفارش‌ها' },
  { to: 'customers', label: 'کاربران' },
  { to: 'reviews', label: 'نظرات' },
  { to: 'discounts', label: 'تخفیف‌ها' },
  { to: 'media', label: 'رسانه' },
  { to: 'analytics', label: 'آنالیتیکس' },
  { to: 'seo', label: 'SEO' },
  { to: 'pages', label: 'صفحات' },
  { to: 'settings', label: 'تنظیمات' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const base = getAdminPrefix();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(base, { replace: true });
    }
  }, [navigate, base]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">مدیریت فروشگاه ماگ</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">UI فقط</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`${base}`)}
              className="px-3 py-1.5 rounded bg-amber-600 text-white text-sm hover:bg-amber-700"
            >
              صفحه ورود
            </button>
            <button
              onClick={() => { clearSession(); navigate(`${base}`); }}
              className="px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <aside className="md:sticky md:top-[64px] md:h-[calc(100vh-80px)] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
          <nav className="flex md:flex-col gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ''}
                className={({ isActive }) =>
                  `px-3 py-2 rounded text-sm whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-600 text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-h-[60vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


