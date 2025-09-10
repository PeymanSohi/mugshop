import React, { useState } from 'react';
import { User, Order, Address } from '../types';
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  Settings, 
  Heart,
  ShoppingBag,
  Bell,
  Shield,
  LogOut,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
  onUpdateProfile: (userData: Partial<User>) => void;
  onAddAddress: (address: Omit<Address, 'id'>) => void;
  onUpdateAddress: (addressId: string, address: Partial<Address>) => void;
  onDeleteAddress: (addressId: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  orders,
  onLogout,
  onUpdateProfile,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'preferences'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  const tabs = [
    { id: 'profile', label: 'پروفایل', icon: UserIcon },
    { id: 'orders', label: 'سفارشات', icon: Package },
    { id: 'addresses', label: 'آدرس‌ها', icon: MapPin },
    { id: 'preferences', label: 'تنظیمات', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'confirmed': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'تحویل داده شده';
      case 'shipped': return 'ارسال شده';
      case 'confirmed': return 'تأیید شده';
      case 'pending': return 'در انتظار';
      case 'cancelled': return 'لغو شده';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  عضو از {user.createdAt.toLocaleDateString('fa-IR')}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 rtl:space-x-reverse text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-right transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">اطلاعات شخصی</h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditingProfile ? 'لغو' : 'ویرایش'}</span>
                  </button>
                </div>

                {isEditingProfile ? (
                  <ProfileEditForm 
                    user={user} 
                    onSave={onUpdateProfile}
                    onCancel={() => setIsEditingProfile(false)}
                  />
                ) : (
                  <ProfileView user={user} />
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">سفارشات من</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">هنوز سفارشی نداده‌اید</h3>
                    <p className="text-gray-600 dark:text-gray-300">وقتی اولین سفارش خود را ثبت کنید، اینجا نمایش داده می‌شود.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              سفارش #{order.id}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {order.createdAt.toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          <div className="text-left">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                              {order.total.toLocaleString('fa-IR')} تومان
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">محصولات:</h4>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-300">
                                    {item.product.name} × {item.quantity}
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    {(item.product.salePrice || item.product.price * item.quantity).toLocaleString('fa-IR')} تومان
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">آدرس ارسال:</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {order.shippingAddress.fullName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {order.shippingAddress.address}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {order.shippingAddress.city}، {order.shippingAddress.province}
                            </p>
                          </div>
                        </div>

                        {order.trackingNumber && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">کد پیگیری:</span> {order.trackingNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">آدرس‌های من</h2>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن آدرس</span>
                  </button>
                </div>

                {isAddingAddress && (
                  <AddressForm
                    onSave={(address) => {
                      onAddAddress(address);
                      setIsAddingAddress(false);
                    }}
                    onCancel={() => setIsAddingAddress(false)}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses?.map((address) => (
                    <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{address.title}</h3>
                          {address.isDefault && (
                            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full mt-1">
                              پیش‌فرض
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => setEditingAddress(address.id)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p>{address.fullName}</p>
                        <p>{address.phone}</p>
                        <p>{address.address}</p>
                        <p>{address.city}، {address.province}</p>
                        <p>کد پستی: {address.postalCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">تنظیمات</h2>
                <PreferencesForm user={user} onSave={onUpdateProfile} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile View Component
const ProfileView: React.FC<{ user: User }> = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام کامل</label>
      <p className="text-gray-900 dark:text-white">{user.name}</p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ایمیل</label>
      <p className="text-gray-900 dark:text-white">{user.email}</p>
    </div>
    {user.phone && (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">شماره تلفن</label>
        <p className="text-gray-900 dark:text-white">{user.phone}</p>
      </div>
    )}
    {user.dateOfBirth && (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاریخ تولد</label>
        <p className="text-gray-900 dark:text-white">{user.dateOfBirth.toLocaleDateString('fa-IR')}</p>
      </div>
    )}
    {user.gender && (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">جنسیت</label>
        <p className="text-gray-900 dark:text-white">
          {user.gender === 'male' ? 'مرد' : user.gender === 'female' ? 'زن' : 'سایر'}
        </p>
      </div>
    )}
  </div>
);

// Profile Edit Form Component
const ProfileEditForm: React.FC<{
  user: User;
  onSave: (userData: Partial<User>) => void;
  onCancel: () => void;
}> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
    gender: user.gender || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      gender: formData.gender as 'male' | 'female' | 'other' | undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام کامل</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره تلفن</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تاریخ تولد</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">جنسیت</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">انتخاب کنید</option>
            <option value="male">مرد</option>
            <option value="female">زن</option>
            <option value="other">سایر</option>
          </select>
        </div>
      </div>
      
      <div className="flex space-x-4 rtl:space-x-reverse">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          ذخیره تغییرات
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          لغو
        </button>
      </div>
    </form>
  );
};

// Address Form Component
const AddressForm: React.FC<{
  onSave: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    title: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">افزودن آدرس جدید</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع آدرس</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="home">خانه</option>
            <option value="work">محل کار</option>
            <option value="other">سایر</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان آدرس</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="مثل: خانه، محل کار"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نام کامل</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شماره تلفن</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">آدرس کامل</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">شهر</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">استان</label>
          <input
            type="text"
            value={formData.province}
            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">کد پستی</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="mr-2 block text-sm text-gray-700 dark:text-gray-300">
            آدرس پیش‌فرض
          </label>
        </div>
      </div>
      
      <div className="flex space-x-4 rtl:space-x-reverse mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          ذخیره آدرس
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          لغو
        </button>
      </div>
    </form>
  );
};

// Preferences Form Component
const PreferencesForm: React.FC<{
  user: User;
  onSave: (userData: Partial<User>) => void;
}> = ({ user, onSave }) => {
  const [preferences, setPreferences] = useState({
    language: user.preferences?.language || 'fa',
    currency: user.preferences?.currency || 'IRR',
    theme: user.preferences?.theme || 'auto',
    notifications: {
      email: user.preferences?.notifications?.email ?? true,
      sms: user.preferences?.notifications?.sms ?? false,
      push: user.preferences?.notifications?.push ?? true
    }
  });

  const handleSave = () => {
    onSave({
      preferences: {
        ...preferences,
        notifications: { ...preferences.notifications }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">زبان</label>
        <select
          value={preferences.language}
          onChange={(e) => setPreferences({ ...preferences, language: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="fa">فارسی</option>
          
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">واحد پول</label>
        <select
          value={preferences.currency}
          onChange={(e) => setPreferences({ ...preferences, currency: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="IRR">تومان</option>
          
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تم</label>
        <select
          value={preferences.theme}
          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="light">روشن</option>
          <option value="dark">تیره</option>
          <option value="auto">خودکار</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">اعلان‌ها</label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">ایمیل</span>
            <input
              type="checkbox"
              checked={preferences.notifications.email}
              onChange={(e) => setPreferences({
                ...preferences,
                notifications: { ...preferences.notifications, email: e.target.checked }
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">پیامک</span>
            <input
              type="checkbox"
              checked={preferences.notifications.sms}
              onChange={(e) => setPreferences({
                ...preferences,
                notifications: { ...preferences.notifications, sms: e.target.checked }
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">اعلان مرورگر</span>
            <input
              type="checkbox"
              checked={preferences.notifications.push}
              onChange={(e) => setPreferences({
                ...preferences,
                notifications: { ...preferences.notifications, push: e.target.checked }
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        ذخیره تنظیمات
      </button>
    </div>
  );
};

export default UserDashboard;
