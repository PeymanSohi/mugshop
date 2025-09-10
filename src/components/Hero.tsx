/** @type {import('tailwindcss').Config} */
export default {
  content: [
          <motion.h1 
            id="hero-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('hero.subtitle')}
          </motion.p>
        'xs': '475px',
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
        'lg': '1024px',
        'xl': '1280px',
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={t('hero.cta')}
        '2xl': '1536px',
              <span>{t('hero.cta')}</span>
      },
            </motion.button>
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
                <div className="whitespace-nowrap">{t('hero.stats.customers')}</div>
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
                <div className="whitespace-nowrap">{t('hero.stats.designs')}</div>
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
                <div className="whitespace-nowrap">{t('hero.stats.rating')}</div>
      },
      fontFamily: {
          </motion.div>
      aria-labelledby="hero-title"
    >
    },
  },
  darkMode: 'class',
  plugins: [],
};