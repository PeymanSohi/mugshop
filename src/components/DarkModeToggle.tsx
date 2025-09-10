import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';
import { useTranslation } from 'react-i18next';

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useDarkMode();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label={t('a11y.toggleDarkMode')}
      title={t('a11y.toggleDarkMode')}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          rotate: isDark ? 180 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="h-5 w-5 text-yellow-500" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          rotate: isDark ? 0 : -180,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="h-5 w-5 text-blue-400" />
      </motion.div>
      
      {/* Invisible content to maintain button size */}
      <div className="opacity-0">
        <Sun className="h-5 w-5" />
      </div>
    </button>
  );
};

export default DarkModeToggle;