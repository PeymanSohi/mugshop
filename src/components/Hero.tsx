import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            ماگ‌های دست‌ساز برای
            <span className="text-amber-700 block">علاقه‌مندان قهوه</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            مجموعه‌ای از ماگ‌های پریمیوم و دست‌ساز که تجربه روزانه شما از قهوه را به لحظه‌ای لذت‌بخش تبدیل می‌کند.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToProducts}
              className="bg-amber-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>خرید کنید</span>
              <ArrowDown className="h-4 w-4" />
            </button>
            
            <div className="flex items-center space-x-6 rtl:space-x-reverse text-sm text-gray-600">
              <div className="text-center">
                <div className="font-semibold text-gray-900">500+</div>
                <div>مشتریان راضی</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">50+</div>
                <div>طرح‌های منحصربه‌فرد</div>
              </div>
              <div className="text-center">
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