import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import ApiService from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  monthlyOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getOrderStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری آمار');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="بارگذاری آمار..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">خطا در بارگذاری</h3>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
        <button
          onClick={loadStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'کل سفارشات',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'سفارشات امروز',
      value: stats?.todayOrders || 0,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'سفارشات ماه جاری',
      value: stats?.monthlyOrders || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'سفارشات در انتظار',
      value: stats?.pendingOrders || 0,
      icon: Package,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'کل درآمد',
      value: `${(stats?.totalRevenue || 0).toLocaleString('fa-IR')} تومان`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'درآمد ماه جاری',
      value: `${(stats?.monthlyRevenue || 0).toLocaleString('fa-IR')} تومان`,
      icon: BarChart3,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">داشبورد مدیریت</h1>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          به‌روزرسانی آمار
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-2`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString('fa-IR') : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">عملیات سریع</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-800 dark:text-blue-200 font-medium">افزودن محصول</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg transition-colors">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 font-medium">مدیریت کاربران</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg transition-colors">
            <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-800 dark:text-purple-200 font-medium">مشاهده سفارشات</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900 hover:bg-orange-100 dark:hover:bg-orange-800 rounded-lg transition-colors">
            <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <span className="text-orange-800 dark:text-orange-200 font-medium">گزارش‌ها</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">فعالیت‌های اخیر</h2>
        <div className="space-y-3">
          {[
            { action: 'سفارش جدید دریافت شد', time: '۵ دقیقه پیش', type: 'order' },
            { action: 'محصول جدید اضافه شد', time: '۱ ساعت پیش', type: 'product' },
            { action: 'کاربر جدید ثبت‌نام کرد', time: '۲ ساعت پیش', type: 'user' },
            { action: 'سفارش ارسال شد', time: '۳ ساعت پیش', type: 'order' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'order' ? 'bg-green-500' :
                activity.type === 'product' ? 'bg-blue-500' : 'bg-purple-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;