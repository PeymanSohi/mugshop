import { isLocked, lockFor, setSession } from '../utils/adminAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminPrefix } from '../utils/adminPrefix';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Debug: surface which credentials are active at runtime (visible only in console)
  // This helps verify whether .env values were embedded at build time.
  if (typeof window !== 'undefined' && (window as any).__MUGSHOP_ENV_LOGGED !== true) {
    // eslint-disable-next-line no-console
    console.info('[Mugshop] Admin credentials from env:', {
      VITE_ADMIN_USERNAME: import.meta.env.VITE_ADMIN_USERNAME,
      VITE_ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD,
      VITE_ADMIN_PREFIX: import.meta.env.VITE_ADMIN_PREFIX
    });
    (window as any).__MUGSHOP_ENV_LOGGED = true;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const expectedPass = import.meta.env.VITE_ADMIN_PASSWORD || 'ChangeMe_Admin_123';
    const inputUser = username.trim();
    const inputPass = password.trim();
    if (isLocked()) {
      setError('حساب به صورت موقت قفل شده است. کمی بعد تلاش کنید.');
      return;
    }
    if (inputUser === expectedUser && inputPass === expectedPass) {
      setSession(60); // 60 minutes session
      setError('');
      const base = getAdminPrefix();
      navigate(`${base}/dashboard`);
    } else {
      setError('رمز عبور اشتباه است');
      // lock for 30 seconds after 5 failed attempts
      const k = 'mugshop-admin-attempts';
      const attempts = Number(localStorage.getItem(k) || '0') + 1;
      localStorage.setItem(k, String(attempts));
      if (attempts >= 5) {
        lockFor(30 * 1000);
        localStorage.setItem(k, '0');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">ورود ادمین</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">نام کاربری</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">رمز عبور</label>
            <input
              type="password"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-md py-2 font-medium"
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
}


