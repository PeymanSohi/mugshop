import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Edit3, Save, Eye, EyeOff } from 'lucide-react';
import { UserType, Address } from '../types';

interface UnifiedProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSave: (userData: Partial<UserType>) => Promise<void>;
  onAddAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  onUpdateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  onDeleteAddress: (addressId: string) => Promise<void>;
}

// Iranian cities list
const iranianCities = [
  'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'قم', 'اهواز', 'کرمانشاه', 'ارومیه',
  'زاهدان', 'رشت', 'کرمان', 'همدان', 'یزد', 'اردبیل', 'بندرعباس', 'قزوین', 'زنجان', 'ساری',
  'گرگان', 'بوشهر', 'خرم‌آباد', 'سنندج', 'یاسوج', 'بیرجند', 'شهرکرد', 'ایلام', 'اراک', 'سمنان',
  'بجنورد', 'بابلسر', 'آمل', 'ساری', 'نوشهر', 'تنکابن', 'رامسر', 'قائم‌شهر', 'سوادکوه', 'فیروزکوه'
];

const UnifiedProfileModal: React.FC<UnifiedProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  // Personal info form
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
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
        city: user.country || '', // Using country field for city
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
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {
      alert('نام، نام خانوادگی و ایمیل الزامی است');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        country: personalInfo.city, // Using country field for city
        dateOfBirth: personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : undefined,
        gender: personalInfo.gender
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('خطا در ذخیره اطلاعات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword) {
      alert('تمام فیلدهای رمز عبور الزامی است');
      return;
    }

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert('رمز عبور جدید و تأیید آن مطابقت ندارند');
      return;
    }

    if (passwordInfo.newPassword.length < 6) {
      alert('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
      return;
    }

    setIsLoading(true);
    try {
      // This would need to be implemented in the backend
      alert('تغییر رمز عبور در حال توسعه است');
      setPasswordInfo({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('خطا در تغییر رمز عبور');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressForm.title || !addressForm.fullName || !addressForm.phone || !addressForm.address || !addressForm.city) {
      alert('تمام فیلدهای آدرس الزامی است');
      return;
    }

    // Validate phone number format
    if (!/^09\d{9}$/.test(addressForm.phone)) {
      alert('شماره تلفن باید ۱۱ رقم باشد و با ۰۹ شروع شود (مثال: ۰۹۱۲۰۳۱۸۱۲۰)');
      return;
    }

    setIsLoading(true);
    try {
      if (editingAddressId) {
        await onUpdateAddress(editingAddressId, addressForm);
      } else {
        await onAddAddress(addressForm);
      }
      
      // Reset form
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
        isDefault: false
      });
      setEditingAddressId(null);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('خطا در ذخیره آدرس');
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
      isDefault: address.isDefault
    });
    setEditingAddressId(address.id);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
      try {
        await onDeleteAddress(addressId);
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('خطا در حذف آدرس');
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
                پروفایل کاربری - {user.firstName} {user.lastName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Personal Information Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  اطلاعات شخصی
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900 dark:hover:bg-primary-800 rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditing ? 'لغو ویرایش' : 'ویرایش'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نام <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
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
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="نام خانوادگی"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    ایمیل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
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
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                      if (value.length <= 11) {
                        handlePersonalInfoChange('phone', value);
                      }
                    }}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="09123456789"
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    شهر
                  </label>
                  <select
                    value={personalInfo.city}
                    onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  >
                    <option value="">انتخاب شهر</option>
                    {iranianCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    تاریخ تولد
                  </label>
                  <input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    جنسیت
                  </label>
                  <select
                    value={personalInfo.gender}
                    onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                    <option value="other">سایر</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSavePersonalInfo}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                  </button>
                </div>
              )}
            </div>

            {/* Addresses Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5" />
                آدرس‌ها
              </h3>

              {/* Address Form */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  {editingAddressId ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      نوع آدرس
                    </label>
                    <select
                      value={addressForm.type}
                      onChange={(e) => handleAddressChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="home">منزل</option>
                      <option value="work">محل کار</option>
                      <option value="other">سایر</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      عنوان آدرس
                    </label>
                    <input
                      type="text"
                      value={addressForm.title}
                      onChange={(e) => handleAddressChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="مثال: آدرس منزل"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="نام و نام خانوادگی گیرنده"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      شماره تلفن
                    </label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                        if (value.length <= 11) {
                          handleAddressChange('phone', value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="09123456789"
                      maxLength={11}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    آدرس کامل
                  </label>
                  <textarea
                    value={addressForm.address}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="آدرس کامل را وارد کنید"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      خیابان
                    </label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="نام خیابان"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      شهر
                    </label>
                    <select
                      value={addressForm.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">انتخاب شهر</option>
                      {iranianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      استان
                    </label>
                    <input
                      type="text"
                      value={addressForm.province}
                      onChange={(e) => handleAddressChange('province', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="نام استان"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => handleAddressChange('isDefault', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">آدرس پیش‌فرض</span>
                  </label>
                  
                  <div className="flex gap-2">
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
                            isDefault: false
                          });
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        لغو
                      </button>
                    )}
                    <button
                      onClick={handleSaveAddress}
                      disabled={isLoading}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'در حال ذخیره...' : editingAddressId ? 'به‌روزرسانی' : 'افزودن آدرس'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Addresses */}
              <div className="space-y-3">
                {user.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((address) => (
                    <div key={address.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-gray-900 dark:text-white">{address.title}</h5>
                            {address.isDefault && (
                              <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded">
                                پیش‌فرض
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {address.fullName} - {address.phone}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {address.address}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {address.city}, {address.province}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="ویرایش"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="حذف"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    هیچ آدرسی ثبت نشده است
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedProfileModal;
