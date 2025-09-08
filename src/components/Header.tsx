import React from 'react';
import { Coffee, ShoppingCart, Search, User, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  cartItemCount: number;
  onCartToggle: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  user: UserType | null;
  onLoginToggle: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartItemCount, 
  onCartToggle, 
  searchTerm, 
  onSearchChange, 
  user, 
  onLoginToggle, 
  onLogout 
}) => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Coffee className="h-8 w-8 text-amber-700" />
            <h1 className="text-2xl font-bold text-gray-900">ماگ‌کرفت</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="جستجوی ماگ..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {user ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <LogOut className="h-4 w-4" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginToggle}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span>ورود</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartToggle}
              className="relative bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors duration-200 flex items-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>سبد خرید</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;