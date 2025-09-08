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
            Handcrafted Mugs for
            <span className="text-amber-700 block">Coffee Lovers</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our collection of premium, handcrafted mugs that transform your daily coffee ritual into an extraordinary experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToProducts}
              className="bg-amber-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Shop Now</span>
              <ArrowDown className="h-4 w-4" />
            </button>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="text-center">
                <div className="font-semibold text-gray-900">500+</div>
                <div>Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">50+</div>
                <div>Unique Designs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">4.9★</div>
                <div>Average Rating</div>
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