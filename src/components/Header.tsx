import React, { useEffect, useState } from 'react';
import { Coffee, ShoppingCart, Search, User, LogOut, Menu, X, Moon, Sun, Heart } from 'lucide-react';
import { User as UserType } from '../types';
import MobileMenu from './MobileMenu';
import ResponsiveContainer from './ResponsiveContainer';
import MobileMenu from './MobileMenu';
import ResponsiveContainer from './ResponsiveContainer';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));


  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40">
        <ResponsiveContainer maxWidth="3xl" padding="md">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="باز کردن منو"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">ماگ‌کرفت</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
              <a href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                صفحه اصلی
              </a>
              <a href="/products" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                محصولات
              </a>
              <a href="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                درباره ما
              </a>
              <a href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                تماس با ما
              </a>
            </nav>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="جستجوی ماگ..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                aria-label="تغییر تم" 
                className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>

              {/* Wishlist - Hidden on mobile */}
              <button className="hidden sm:flex p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* User Actions - Desktop */}
              <div className="hidden lg:flex items-center gap-3">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <User className="h-5 w-5" />
                      <span className="font-medium text-sm xl:text-base">{user.name}</span>
                    </div>
                    <button
                      onClick={onLogout}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 flex items-center gap-1 text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>خروج</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onLoginToggle}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    <User className="h-4 w-4" />
                    <span>ورود</span>
                  </button>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={onCartToggle}
                className="relative bg-primary-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-1 sm:gap-2"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-sm">سبد خرید</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="جستجوی ماگ..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pr-10 pl-4 py-2 text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </ResponsiveContainer>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={closeMobile}
        user={user}
        onLoginToggle={onLoginToggle}
        onLogout={onLogout}
      />
    </>
  );
};

export default Header;
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="باز کردن منو"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">ماگ‌کرفت</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
              <a href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                صفحه اصلی
              </a>
              <a href="/products" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                محصولات
              </a>
              <a href="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                درباره ما
              </a>
              <a href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                تماس با ما
              </a>
            </nav>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="جستجوی ماگ..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                aria-label="تغییر تم" 
                className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>

              {/* Wishlist - Hidden on mobile */}
              <button className="hidden sm:flex p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* User Actions - Desktop */}
              <div className="hidden lg:flex items-center gap-3">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <User className="h-5 w-5" />
                      <span className="font-medium text-sm xl:text-base">{user.name}</span>
                    </div>
                    <button
                      onClick={onLogout}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 flex items-center gap-1 text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>خروج</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onLoginToggle}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    <User className="h-4 w-4" />
                    <span>ورود</span>
                  </button>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={onCartToggle}
                className="relative bg-primary-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-1 sm:gap-2"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-sm">سبد خرید</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="جستجوی ماگ..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pr-10 pl-4 py-2 text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </ResponsiveContainer>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={closeMobile}
        user={user}
        onLoginToggle={onLoginToggle}
        onLogout={onLogout}
      />
    </>
  );
};

export default Header;
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Coffee className="h-8 w-8 text-amber-700" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ماگ‌کرفت</h1>
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

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="جستجوی ماگ..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} aria-label="تغییر تم" className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginToggle}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
              >
                <User className="h-5 w-5" />
                <span>ورود</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartToggle}
              className="relative bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors duration-200 flex items-center gap-2"
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

      {/* Mobile slide-out panel */}
      <div
        className={`md:hidden fixed inset-0 z-40 ${mobileOpen ? 'block' : 'hidden'}`}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
        <div className="absolute top-0 bottom-0 right-0 w-80 bg-white dark:bg-gray-900 shadow-xl p-4 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="جستجوی ماگ..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {user ? (
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <User className="h-5 w-5" />
                <span className="font-medium">{user.name}</span>
              </div>
              <button onClick={() => { onLogout(); closeMobile(); }} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                <LogOut className="h-4 w-4" /> خروج
              </button>
            </div>
          ) : (
            <button onClick={() => { onLoginToggle(); closeMobile(); }} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2">
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
                {cartItemCount}
              </span>
            )}
          </button>

          <button onClick={toggleTheme} className="mt-2 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span>تغییر تم</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;