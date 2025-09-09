import React, { useState } from 'react';
import { Coffee, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { User as UserType, Product } from '../types';
import EnhancedSearch from './EnhancedSearch';
import { toPersianNumbers } from '../utils/persianNumbers';

interface HeaderProps {
  cartItemCount: number;
  onCartToggle: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  user: UserType | null;
  isAuthenticated: boolean;
  onLoginToggle: () => void;
  onDashboardToggle: () => void;
  onLogout: () => void;
  onProductSelect: (product: Product) => void;
  onCategorySelect: (category: string) => void;
  products: Product[];
  categories: string[];
}

const Header: React.FC<HeaderProps> = ({ 
  cartItemCount, 
  onCartToggle, 
  searchTerm, 
  onSearchChange, 
  user, 
  isAuthenticated,
  onLoginToggle, 
  onDashboardToggle,
  onLogout,
  onProductSelect,
  onCategorySelect,
  products,
  categories
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(v => !v);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Coffee className="h-8 w-8 text-amber-700" />
            <h1 className="text-2xl font-bold text-gray-900">mug.myy</h1>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMobile}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            aria-label="باز کردن منو"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Enhanced Search Bar (desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <EnhancedSearch
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              onProductSelect={onProductSelect}
              onCategorySelect={onCategorySelect}
              products={products}
              categories={categories}
              isOpen={false}
              onClose={() => {}}
            />
          </div>

          {/* User Actions (desktop) */}
          <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  onClick={onDashboardToggle}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                </button>
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
                  {toPersianNumbers(cartItemCount.toString())}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-out panel */}
      <div
        className={`md:hidden fixed inset-0 z-40 ${mobileOpen ? 'block' : 'hidden'}`}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
        <div className="absolute top-0 bottom-0 right-0 w-80 bg-white shadow-xl p-4 flex flex-col gap-4">
          <EnhancedSearch
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onProductSelect={onProductSelect}
            onCategorySelect={onCategorySelect}
            products={products}
            categories={categories}
            isOpen={false}
            onClose={() => {}}
          />

          {isAuthenticated && user ? (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <button
                onClick={() => { onDashboardToggle(); closeMobile(); }}
                className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">{user.name}</span>
              </button>
              <button onClick={() => { onLogout(); closeMobile(); }} className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
                <LogOut className="h-4 w-4" /> خروج
              </button>
            </div>
          ) : (
            <button onClick={() => { onLoginToggle(); closeMobile(); }} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
              <User className="h-5 w-5" /> ورود
            </button>
          )}

          <button
            onClick={() => { onCartToggle(); closeMobile(); }}
            className="relative bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" /> سبد خرید
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {toPersianNumbers(cartItemCount.toString())}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;