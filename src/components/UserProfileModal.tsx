import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Save, Eye, EyeOff } from 'lucide-react';
import { User as UserType, Address } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSave: (userData: Partial<UserType>) => Promise<void>;
  onAddAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  onUpdateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  onDeleteAddress: (addressId: string) => Promise<void>;
}

type TabType = 'personal' | 'addresses' | 'security';

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  // Personal info form
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | 'other' | ''
  });

  // Password change form
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Address form
  const [addressForm, setAddressForm] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    title: '',
    fullName: '',
    phone: '',
    address: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      setPersonalInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
        gender: user.gender || ''
      });
    }
  }, [user, isOpen]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string | boolean) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await onSave(personalInfo);
    } catch (error) {
      console.error('Error saving personal info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert('رمزهای عبور جدید مطابقت ندارند');
      return;
    }
    
    if (passwordInfo.newPassword.length < 6) {
      alert('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    setIsLoading(true);
    try {
      // This would need to be implemented in the backend
      await onSave({ password: passwordInfo.newPassword });
      setPasswordInfo({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('رمز عبور با موفقیت تغییر یافت');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('خطا در تغییر رمز عبور');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.province || !addressForm.postalCode) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    setIsLoading(true);
    try {
      if (editingAddressId) {
        await onUpdateAddress(editingAddressId, addressForm);
        setEditingAddressId(null);
      } else {
        await onAddAddress(addressForm);
      }
      
      setAddressForm({
        type: 'home',
        title: '',
        fullName: '',
        phone: '',
        address: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      type: address.type,
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      street: address.street,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country || '',
      isDefault: address.isDefault
    });
    setEditingAddressId(address.id);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
      setIsLoading(true);
      try {
        await onDeleteAddress(addressId);
      } catch (error) {
        console.error('Error deleting address:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                پروفایل کاربری
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'personal', label: 'اطلاعات شخصی', icon: User },
              { id: 'addresses', label: 'آدرس‌ها', icon: MapPin },
              { id: 'security', label: 'امنیت', icon: Eye }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نام <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="نام"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="نام خانوادگی"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      ایمیل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      شماره تلفن
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="09123456789"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      کشور
                    </label>
                    <select
                      value={personalInfo.country}
                      onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="IR">ایران</option>
                      <option value="US">آمریکا</option>
                      <option value="CA">کانادا</option>
                      <option value="GB">انگلستان</option>
                      <option value="DE">آلمان</option>
                      <option value="FR">فرانسه</option>
                      <option value="IT">ایتالیا</option>
                      <option value="ES">اسپانیا</option>
                      <option value="AU">استرالیا</option>
                      <option value="JP">ژاپن</option>
                      <option value="CN">چین</option>
                      <option value="IN">هند</option>
                      <option value="BR">برزیل</option>
                      <option value="MX">مکزیک</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      تاریخ تولد
                    </label>
                    <input
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      جنسیت
                    </label>
                    <select
                      value={personalInfo.gender}
                      onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="male">مرد</option>
                      <option value="female">زن</option>
                      <option value="other">سایر</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSavePersonalInfo}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                {/* Address List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">آدرس‌های موجود</h3>
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((address) => (
                      <div key={address.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">{address.title}</span>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                                  پیش‌فرض
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {address.fullName} - {address.phone}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {address.street}, {address.city}, {address.province} {address.postalCode}
                              {address.country && `, ${address.country}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-primary-600 hover:text-primary-700 text-sm"
                            >
                              ویرایش
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">هیچ آدرسی ثبت نشده است</p>
                  )}
                </div>

                {/* Add/Edit Address Form */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {editingAddressId ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نوع آدرس <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addressForm.type}
                        onChange={(e) => handleAddressChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="home">خانه</option>
                        <option value="work">محل کار</option>
                        <option value="other">سایر</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        عنوان <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.title}
                        onChange={(e) => handleAddressChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="مثال: خانه اصلی"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نام کامل <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="نام و نام خانوادگی"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شماره تلفن <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="09123456789"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      خیابان و شماره <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="خیابان ولیعصر، پلاک ۱۲۳"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شهر <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="تهران"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        استان <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.province}
                        onChange={(e) => handleAddressChange('province', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="تهران"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        کد پستی <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      کشور
                    </label>
                    <select
                      value={addressForm.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="IR">ایران</option>
                      <option value="US">آمریکا</option>
                      <option value="CA">کانادا</option>
                      <option value="GB">انگلستان</option>
                      <option value="DE">آلمان</option>
                      <option value="FR">فرانسه</option>
                      <option value="IT">ایتالیا</option>
                      <option value="ES">اسپانیا</option>
                      <option value="AU">استرالیا</option>
                      <option value="JP">ژاپن</option>
                      <option value="CN">چین</option>
                      <option value="IN">هند</option>
                      <option value="BR">برزیل</option>
                      <option value="MX">مکزیک</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => handleAddressChange('isDefault', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">آدرس پیش‌فرض</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    {editingAddressId && (
                      <button
                        onClick={() => {
                          setEditingAddressId(null);
                          setAddressForm({
                            type: 'home',
                            title: '',
                            fullName: '',
                            phone: '',
                            address: '',
                            street: '',
                            city: '',
                            province: '',
                            postalCode: '',
                            country: '',
                            isDefault: false
                          });
                        }}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        انصراف
                      </button>
                    )}
                    <button
                      onClick={handleSaveAddress}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? 'در حال ذخیره...' : editingAddressId ? 'به‌روزرسانی آدرس' : 'افزودن آدرس'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">تغییر رمز عبور</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رمز عبور فعلی <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordInfo.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="رمز عبور فعلی"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رمز عبور جدید <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInfo.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="رمز عبور جدید"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      تأیید رمز عبور جدید <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordInfo.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="تأیید رمز عبور جدید"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading || !passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword}
                    className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
