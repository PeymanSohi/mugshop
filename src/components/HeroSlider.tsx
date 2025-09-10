import React, { useEffect, useMemo, useState } from 'react';

const HERO_IMAGES: string[] = [
  '/mugs/image.jpeg',
  '/mugs/image-3.jpeg',
  '/mugs/image-5.jpeg'
];

const AUTO_INTERVAL_MS = 3500;

const HeroSlider: React.FC = () => {
  const images = useMemo(() => HERO_IMAGES.filter(Boolean), []);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length, isPaused]);

  const goPrev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              ماگ‌های دست‌ساز برای لحظه‌های خاص شما
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              مجموعه‌ای از ماگ‌های باکیفیت با طراحی‌های منحصربه‌فرد. مناسب برای قهوه، چای و هدیه دادن به عزیزان.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#products" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors min-h-[44px]">
                مشاهده محصولات
              </a>
              <a href="#about" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]">
                بیشتر بدانید
              </a>
            </div>
          </div>

          <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <div className="relative aspect-[4/3] rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`اسلاید ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}

              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full px-3 py-1"
                    aria-label="تصویر قبلی"
                  >
                    ‹
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full px-3 py-1"
                    aria-label="تصویر بعدی"
                  >
                    ›
                  </button>
                </>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`رفتن به اسلاید ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={`h-2 w-2 rounded-full transition-all ${i === index ? 'w-6 bg-primary-600' : 'bg-white/70 hover:bg-white'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary-600 text-white text-xs sm:text-sm px-3 py-2 rounded-lg shadow-lg">
              ارسال رایگان برای سفارش‌های بالای ۱۰۰٬۰۰۰ تومان
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;


