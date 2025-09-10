import React, { useState } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCurrency, Currency } from '../hooks/useCurrency';

const currencies = [
  { code: 'IRR' as Currency, name: 'تومان', symbol: '﷼' },
  { code: 'USD' as Currency, name: 'Dollar', symbol: '$' },
  { code: 'EUR' as Currency, name: 'Euro', symbol: '€' }
];

const CurrencySwitcher: React.FC = () => {
  const { t } = useTranslation();
  const [{ currency }, updateCurrency] = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = currencies.find(curr => curr.code === currency) || currencies[0];

  const handleCurrencyChange = (currencyCode: Currency) => {
    updateCurrency(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        aria-label={t('a11y.changeCurrency')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentCurrency.symbol}
        </span>
        <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-[120px]"
              role="menu"
            >
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencyChange(curr.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    curr.code === currency
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-200'
                  }`}
                  role="menuitem"
                >
                  <span className="text-lg">{curr.symbol}</span>
                  <span className="font-medium">{curr.name}</span>
                  {curr.code === currency && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySwitcher;