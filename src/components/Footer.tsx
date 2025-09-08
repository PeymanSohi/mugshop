import React from 'react';
import { Coffee, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-8 w-8 text-amber-400" />
              <h3 className="text-2xl font-bold">ماگ‌کرفت</h3>
            </div>
            <p className="text-gray-300 mb-4">
              ماگ‌های دست‌ساز و باکیفیت برای علاقه‌مندان حرفه‌ای قهوه.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">لینک‌های سریع</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-amber-400 transition-colors">درباره ما</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">داستان ما</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">سفارش سفارشی</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">عمده‌فروشی</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">خدمات مشتریان</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-amber-400 transition-colors">اطلاعات ارسال</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">بازگشت کالا</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">راهنمای اندازه</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">راهنمای نگهداری</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تماس با ما</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@mugcraft.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>پورتلند، اورِگون</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>© ۲۰۲۵ ماگ‌کرفت. کلیه حقوق محفوظ است. با عشق ساخته‌شده در پورتلند.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;