import React from 'react';
import { Coffee, Mail, Phone, MapPin, Instagram } from 'lucide-react';
import ResponsiveContainer from './ResponsiveContainer';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <ResponsiveContainer maxWidth="3xl" padding="lg" className="py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-primary-400" />
              <h3 className="text-xl sm:text-2xl font-bold">mug.myy</h3>
            </div>
            <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
              ماگ‌های دست‌ساز و باکیفیت برای علاقه‌مندان حرفه‌ای قهوه.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">لینک‌های سریع</h4>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li><a href="#" className="hover:text-primary-400 transition-colors">درباره ما</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">داستان ما</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">سفارش سفارشی</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">عمده‌فروشی</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">خدمات مشتریان</h4>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li><a href="#" className="hover:text-primary-400 transition-colors">اطلاعات ارسال</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">بازگشت کالا</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">راهنمای اندازه</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">راهنمای نگهداری</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">تماس با ما</h4>
            <div className="space-y-3 text-gray-300 text-sm sm:text-base">
              <div className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <a href="mailto:mutmakian@gmail.com" className="break-all">mutmakian@gmail.com</a>
              </div>
              <div className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Instagram className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <a href="https://www.instagram.com/mug.myy" target="_blank" rel="noopener noreferrer" className="hover:underline">@mug.myy</a>
              </div>
              <div className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>تهران، ایران</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-300">
          <p className="text-xs sm:text-sm leading-relaxed">
            © ۲۰۲۵ mug.myy. کلیه حقوق محفوظ است. با عشق ساخته‌شده در پورتلند.
          </p>
        </div>
      </ResponsiveContainer>
    </footer>
  );
};

export default Footer;