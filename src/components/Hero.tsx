import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-300 rounded-full opacity-25 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            ماگ‌های دست‌ساز برای
            <span className="text-amber-700 block animate-fade-in-up-delay">علاقه‌مندان قهوه</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up-delay-2">
            مجموعه‌ای از ماگ‌های پریمیوم و دست‌ساز که تجربه روزانه شما از قهوه را به لحظه‌ای لذت‌بخش تبدیل می‌کند.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay-3">
            <button
              onClick={scrollToProducts}
              className="bg-amber-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-800 transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg transform"
            >
              <span>خرید کنید</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </button>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="text-center hover:scale-110 transition-transform duration-200">
                <div className="font-semibold text-gray-900">500+</div>
                <div>مشتریان راضی</div>
              </div>
              <div className="text-center hover:scale-110 transition-transform duration-200">
                <div className="font-semibold text-gray-900">50+</div>
                <div>طرح‌های منحصربه‌فرد</div>
              </div>
              <div className="text-center hover:scale-110 transition-transform duration-200">
                <div className="font-semibold text-gray-900">4.9★</div>
                <div>میانگین امتیاز</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default Hero;