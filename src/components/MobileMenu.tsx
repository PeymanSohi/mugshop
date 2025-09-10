import React, { useEffect } from 'react';
import { X, Home, ShoppingBag, User, Heart, Settings, Phone, Info } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLoginToggle: () => void;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  user,
  onLoginToggle,
  onLogout
}) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: Home, label: 'صفحه اصلی', href: '/' },
    { icon: ShoppingBag, label: 'محصولات', href: '/products' },
    { icon: Heart, label: 'علاقه‌مندی‌ها', href: '/wishlist' },
    { icon: Info, label: 'درباره ما', href: '/about' },
    { icon: Phone, label: 'تماس با ما', href: '/contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">منو</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="بستن منو"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                خروج
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onLoginToggle();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>ورود / ثبت‌نام</span>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>mug.myy © ۲۰۲۵ • تهران، ایران</p>
            <p>
              <a href="https://www.instagram.com/mug.myy" target="_blank" rel="noopener noreferrer" className="hover:underline">@mug.myy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;