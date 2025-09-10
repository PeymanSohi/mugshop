import React, { useState } from 'react';
import { Coffee, ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User as UserType, Product } from '../types';
import DarkModeToggle from './DarkModeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';
import SkipToContent from './SkipToContent';
import { useCurrency, formatPrice } from '../hooks/useCurrency';

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
  onLogout
}) => {
  const { t } = useTranslation();
  const [{ currency, rates }] = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const toggleMobile = () => setMobileOpen(v => !v);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <SkipToContent />
      <header 
        className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2 rtl:space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Coffee className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">mug.myy</h1>
            </motion.div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <DarkModeToggle />
              <button
                onClick={toggleMobile}
                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label={mobileOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Search Bar (desktop) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={t('a11y.searchProducts')}
                  className={`block w-full pr-10 pl-3 py-2 border rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all duration-200 ${
                    searchFocused 
                      ? 'border-primary-300 dark:border-primary-600 shadow-lg' 
                      : 'border-gray-300 dark:border-gray-600'
                  } dark:text-white`}
                  aria-label={t('a11y.searchProducts')}
                />
              </div>
            </div>

            {/* User Actions (desktop) */}
            <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
              <LanguageSwitcher />
              <CurrencySwitcher />
              <DarkModeToggle />
              
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <button
                    onClick={onDashboardToggle}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.name}</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    aria-label={t('nav.logout')}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginToggle}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <User className="h-5 w-5" />
                  <span>{t('nav.login')}</span>
                </button>
              )}

              {/* Cart Button */}
              <motion.button
                onClick={onCartToggle}
                className="relative bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`${t('nav.cart')} (${cartItemCount})`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{t('nav.cart')}</span>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile slide-out panel */}
        <AnimatePresence>
          {mobileOpen && (
            <div className="md:hidden fixed inset-0 z-40">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40"
                onClick={closeMobile}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute top-0 bottom-0 right-0 w-80 bg-white dark:bg-gray-900 shadow-xl p-4 flex flex-col gap-4"
              >
                {/* Mobile Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('a11y.searchProducts')}
                    className="block w-full pr-10 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm dark:text-white"
                  />
                </div>

                {/* Mobile Controls */}
                <div className="flex items-center justify-between">
                  <LanguageSwitcher />
                  <CurrencySwitcher />
                </div>

                {isAuthenticated && user ? (
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <button
                      onClick={() => { onDashboardToggle(); closeMobile(); }}
                      className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">{user.name}</span>
                    </button>
                    <button 
                      onClick={() => { onLogout(); closeMobile(); }} 
                      className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
                    >
                      <LogOut className="h-4 w-4" /> {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { onLoginToggle(); closeMobile(); }} 
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 justify-center"
                  >
                    <User className="h-5 w-5" /> {t('nav.login')}
                  </button>
                )}

                <button
                  onClick={() => { onCartToggle(); closeMobile(); }}
                  className="relative bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" /> {t('nav.cart')}
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;