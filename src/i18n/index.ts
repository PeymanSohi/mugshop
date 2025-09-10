import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  fa: {
    translation: {
      // Navigation
      'nav.home': 'خانه',
      'nav.products': 'محصولات',
      'nav.about': 'درباره ما',
      'nav.contact': 'تماس با ما',
      'nav.cart': 'سبد خرید',
      'nav.login': 'ورود',
      'nav.logout': 'خروج',
      'nav.dashboard': 'داشبورد',
      
      // Hero Section
      'hero.title': 'ماگ‌های دست‌ساز برای علاقه‌مندان قهوه',
      'hero.subtitle': 'مجموعه‌ای از ماگ‌های پریمیوم و دست‌ساز که تجربه روزانه شما از قهوه را به لحظه‌ای لذت‌بخش تبدیل می‌کند.',
      'hero.cta': 'خرید کنید',
      'hero.stats.customers': 'مشتریان راضی',
      'hero.stats.designs': 'طرح‌های منحصربه‌فرد',
      'hero.stats.rating': 'میانگین امتیاز',
      
      // Products
      'products.title': 'مجموعه ما',
      'products.subtitle': 'مجموعه‌ای از ماگ‌های باکیفیت که تجربه نوشیدن شما را لذت‌بخش‌تر می‌کند.',
      'products.addToCart': 'افزودن به سبد',
      'products.adding': 'در حال افزودن...',
      'products.outOfStock': 'ناموجود',
      'products.freeShipping': 'ارسال رایگان',
      'products.noResults': 'محصولی مطابق فیلترها یافت نشد.',
      'products.clearFilters': 'پاک کردن فیلترها',
      
      // Filters
      'filters.title': 'فیلترها و مرتب‌سازی',
      'filters.categories': 'دسته‌بندی',
      'filters.priceRange': 'محدوده قیمت',
      'filters.rating': 'امتیاز',
      'filters.availability': 'موجودی',
      'filters.inStock': 'فقط موجود',
      'filters.onSale': 'تخفیف‌دار',
      'filters.sort': 'مرتب‌سازی',
      'filters.sort.relevance': 'مرتبط‌ترین',
      'filters.sort.priceAsc': 'قیمت: کم به زیاد',
      'filters.sort.priceDesc': 'قیمت: زیاد به کم',
      'filters.sort.newest': 'جدیدترین',
      'filters.sort.popularity': 'محبوب‌ترین',
      'filters.sort.rating': 'بالاترین امتیاز',
      'filters.clearAll': 'پاک کردن همه',
      'filters.apply': 'اعمال فیلترها',
      
      // Cart
      'cart.title': 'سبد خرید',
      'cart.empty': 'سبد خرید شما خالی است',
      'cart.emptySubtitle': 'برای شروع چند ماگ اضافه کنید!',
      'cart.subtotal': 'جمع کل',
      'cart.shipping': 'هزینه ارسال',
      'cart.free': 'رایگان',
      'cart.discount': 'تخفیف',
      'cart.total': 'مبلغ نهایی',
      'cart.checkout': 'ادامه فرایند خرید',
      'cart.loginRequired': 'برای تکمیل خرید لطفاً وارد شوید',
      'cart.loginButton': 'ورود برای خرید',
      'cart.freeShippingProgress': 'دیگر تا ارسال رایگان',
      
      // Common
      'common.loading': 'در حال بارگذاری...',
      'common.error': 'خطا',
      'common.retry': 'تلاش مجدد',
      'common.close': 'بستن',
      'common.save': 'ذخیره',
      'common.cancel': 'لغو',
      'common.edit': 'ویرایش',
      'common.delete': 'حذف',
      'common.add': 'افزودن',
      'common.remove': 'حذف',
      'common.quantity': 'تعداد',
      'common.price': 'قیمت',
      'common.total': 'مجموع',
      
      // Categories
      'category.all': 'همه',
      'category.classic': 'کلاسیک',
      'category.modern': 'مدرن',
      'category.rustic': 'روستیک',
      'category.vintage': 'وینتیج',
      'category.sets': 'ست‌ها',
      
      // Footer
      'footer.quickLinks': 'لینک‌های سریع',
      'footer.customerService': 'خدمات مشتریان',
      'footer.contact': 'تماس با ما',
      'footer.aboutUs': 'درباره ما',
      'footer.ourStory': 'داستان ما',
      'footer.customOrders': 'سفارش سفارشی',
      'footer.wholesale': 'عمده‌فروشی',
      'footer.shippingInfo': 'اطلاعات ارسال',
      'footer.returns': 'بازگشت کالا',
      'footer.sizeGuide': 'راهنمای اندازه',
      'footer.careGuide': 'راهنمای نگهداری',
      'footer.copyright': '© ۲۰۲۵ mug.myy. کلیه حقوق محفوظ است. با عشق ساخته‌شده در پورتلند.',
      
      // Accessibility
      'a11y.skipToContent': 'رفتن به محتوای اصلی',
      'a11y.openMenu': 'باز کردن منو',
      'a11y.closeMenu': 'بستن منو',
      'a11y.toggleDarkMode': 'تغییر حالت تاریک',
      'a11y.changeLanguage': 'تغییر زبان',
      'a11y.changeCurrency': 'تغییر واحد پول',
      'a11y.productImage': 'تصویر محصول',
      'a11y.addToWishlist': 'افزودن به علاقه‌مندی‌ها',
      'a11y.removeFromWishlist': 'حذف از علاقه‌مندی‌ها',
      'a11y.increaseQuantity': 'افزایش تعداد',
      'a11y.decreaseQuantity': 'کاهش تعداد',
      'a11y.previousImage': 'تصویر قبلی',
      'a11y.nextImage': 'تصویر بعدی',
      'a11y.currentPage': 'صفحه فعلی',
      'a11y.goToPage': 'رفتن به صفحه',
      'a11y.searchProducts': 'جستجوی محصولات',
      'a11y.filterProducts': 'فیلتر محصولات',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fa',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;