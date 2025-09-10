import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.products': 'Products',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.cart': 'Cart',
      'nav.login': 'Login',
      'nav.logout': 'Logout',
      'nav.dashboard': 'Dashboard',
      
      // Hero Section
      'hero.title': 'Handcrafted Mugs for Coffee Lovers',
      'hero.subtitle': 'A premium collection of handmade mugs that transform your daily coffee experience into delightful moments.',
      'hero.cta': 'Shop Now',
      'hero.stats.customers': 'Happy Customers',
      'hero.stats.designs': 'Unique Designs',
      'hero.stats.rating': 'Average Rating',
      
      // Products
      'products.title': 'Our Collection',
      'products.subtitle': 'A collection of quality mugs that make your drinking experience more enjoyable.',
      'products.addToCart': 'Add to Cart',
      'products.adding': 'Adding...',
      'products.outOfStock': 'Out of Stock',
      'products.freeShipping': 'Free Shipping',
      'products.noResults': 'No products found matching your filters.',
      'products.clearFilters': 'Clear Filters',
      
      // Filters
      'filters.title': 'Filters & Sort',
      'filters.categories': 'Categories',
      'filters.priceRange': 'Price Range',
      'filters.rating': 'Rating',
      'filters.availability': 'Availability',
      'filters.inStock': 'In Stock Only',
      'filters.onSale': 'On Sale',
      'filters.sort': 'Sort By',
      'filters.sort.relevance': 'Most Relevant',
      'filters.sort.priceAsc': 'Price: Low to High',
      'filters.sort.priceDesc': 'Price: High to Low',
      'filters.sort.newest': 'Newest',
      'filters.sort.popularity': 'Most Popular',
      'filters.sort.rating': 'Highest Rated',
      'filters.clearAll': 'Clear All',
      'filters.apply': 'Apply Filters',
      
      // Cart
      'cart.title': 'Shopping Cart',
      'cart.empty': 'Your cart is empty',
      'cart.emptySubtitle': 'Add some mugs to get started!',
      'cart.subtotal': 'Subtotal',
      'cart.shipping': 'Shipping',
      'cart.free': 'Free',
      'cart.discount': 'Discount',
      'cart.total': 'Total',
      'cart.checkout': 'Proceed to Checkout',
      'cart.loginRequired': 'Please login to complete your purchase',
      'cart.loginButton': 'Login to Purchase',
      'cart.freeShippingProgress': 'more for free shipping',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.retry': 'Retry',
      'common.close': 'Close',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.add': 'Add',
      'common.remove': 'Remove',
      'common.quantity': 'Quantity',
      'common.price': 'Price',
      'common.total': 'Total',
      
      // Categories
      'category.all': 'All',
      'category.classic': 'Classic',
      'category.modern': 'Modern',
      'category.rustic': 'Rustic',
      'category.vintage': 'Vintage',
      'category.sets': 'Sets',
      
      // Footer
      'footer.quickLinks': 'Quick Links',
      'footer.customerService': 'Customer Service',
      'footer.contact': 'Contact Us',
      'footer.aboutUs': 'About Us',
      'footer.ourStory': 'Our Story',
      'footer.customOrders': 'Custom Orders',
      'footer.wholesale': 'Wholesale',
      'footer.shippingInfo': 'Shipping Info',
      'footer.returns': 'Returns',
      'footer.sizeGuide': 'Size Guide',
      'footer.careGuide': 'Care Guide',
      'footer.copyright': '© 2025 mug.myy. All rights reserved. Made with love in Portland.',
      
      // Accessibility
      'a11y.skipToContent': 'Skip to main content',
      'a11y.openMenu': 'Open menu',
      'a11y.closeMenu': 'Close menu',
      'a11y.toggleDarkMode': 'Toggle dark mode',
      'a11y.changeLanguage': 'Change language',
      'a11y.changeCurrency': 'Change currency',
      'a11y.productImage': 'Product image',
      'a11y.addToWishlist': 'Add to wishlist',
      'a11y.removeFromWishlist': 'Remove from wishlist',
      'a11y.increaseQuantity': 'Increase quantity',
      'a11y.decreaseQuantity': 'Decrease quantity',
      'a11y.previousImage': 'Previous image',
      'a11y.nextImage': 'Next image',
      'a11y.currentPage': 'Current page',
      'a11y.goToPage': 'Go to page',
      'a11y.searchProducts': 'Search products',
      'a11y.filterProducts': 'Filter products',
    }
  },
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