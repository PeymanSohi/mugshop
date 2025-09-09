import React from 'react';
import { ArrowDown } from 'lucide-react';
import ResponsiveContainer from './ResponsiveContainer';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-12 h-12 sm:w-20 sm:h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-32 right-20 w-10 h-10 sm:w-16 sm:h-16 bg-orange-200 dark:bg-orange-800 rounded-full opacity-30 animate-float-reverse"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-primary-300 dark:bg-primary-700 rounded-full opacity-25 animate-pulse-glow"></div>
        <div className="absolute top-1/2 right-1/3 w-6 h-6 sm:w-8 sm:h-8 bg-orange-300 dark:bg-orange-700 rounded-full opacity-20 animate-drift"></div>
        <div className="absolute bottom-32 right-10 w-10 h-10 sm:w-14 sm:h-14 bg-primary-400 dark:bg-primary-600 rounded-full opacity-15 animate-float"></div>
      </div>
      
      <ResponsiveContainer maxWidth="3xl" padding="lg" className="relative z-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 animate-fade-in-up leading-tight">
            ماگ‌های دست‌ساز برای
            <span className="text-primary-600 dark:text-primary-400 block animate-fade-in-up-delay">علاقه‌مندان قهوه</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in-up-delay-2 leading-relaxed px-4 sm:px-0">
            مجموعه‌ای از ماگ‌های پریمیوم و دست‌ساز که تجربه روزانه شما از قهوه را به لحظه‌ای لذت‌بخش تبدیل می‌کند.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay-3">
            <button
              onClick={scrollToProducts}
              className="bg-primary-600 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg transform min-h-[44px] text-sm sm:text-base"
            >
              <span>خرید کنید</span>
              <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
            </button>
            
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="text-center hover:scale-110 transition-transform duration-200 px-2">
                <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">500+</div>
                <div className="whitespace-nowrap">مشتریان راضی</div>
              </div>
              <div className="text-center hover:scale-110 transition-transform duration-200 px-2">
                <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">50+</div>
                <div className="whitespace-nowrap">طرح‌های منحصربه‌فرد</div>
              </div>
              <div className="text-center hover:scale-110 transition-transform duration-200 px-2">
                <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">4.9★</div>
                <div className="whitespace-nowrap">میانگین امتیاز</div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
      
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
    </section>
  );
};

export default Hero;