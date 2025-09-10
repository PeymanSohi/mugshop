import { Product, Review } from '../types';

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userName: 'علی احمدی',
    rating: 5,
    comment: 'ماگ بسیار باکیفیت و زیبا. کاملاً راضی هستم. طراحی کلاسیک و رنگ سفید براق عالی است.',
    date: new Date('2024-01-20')
  },
  {
    id: '2',
    productId: '1',
    userName: 'فاطمه محمدی',
    rating: 4,
    comment: 'خوب است اما کمی کوچک است. برای قهوه صبحگاهی مناسب است.',
    date: new Date('2024-01-18')
  },
  {
    id: '3',
    productId: '1',
    userName: 'رضا نوری',
    rating: 5,
    comment: 'کیفیت سرامیک عالی است. در ماشین ظرف‌شویی هم قابل شست‌وشو است.',
    date: new Date('2024-01-15')
  },
  {
    id: '4',
    productId: '1',
    userName: 'سارا احمدی',
    rating: 5,
    comment: 'ماگ مورد علاقه‌ام شد. هر روز از آن استفاده می‌کنم.',
    date: new Date('2024-01-12')
  },
  {
    id: '5',
    productId: '2',
    userName: 'حسن رضایی',
    rating: 5,
    comment: 'طراحی روستیک فوق‌العاده‌ای دارد. برای دکوراسیون خانه عالی است.',
    date: new Date('2024-01-22')
  },
  {
    id: '6',
    productId: '2',
    userName: 'مریم کریمی',
    rating: 4,
    comment: 'رنگ قهوه‌ای مات خیلی شیک است. کمی سنگین است اما کیفیت خوبی دارد.',
    date: new Date('2024-01-19')
  },
  {
    id: '7',
    productId: '2',
    userName: 'محمد صادقی',
    rating: 5,
    comment: 'کیفیت عالی و قیمت مناسب. برای هدیه دادن عالی است.',
    date: new Date('2024-01-16')
  },
  {
    id: '8',
    productId: '3',
    userName: 'نرگس رضایی',
    rating: 4,
    comment: 'رنگ مشکی مات خیلی شیک است. برای محیط کار عالی است.',
    date: new Date('2024-02-02')
  },
  {
    id: '9',
    productId: '3',
    userName: 'امیر حسینی',
    rating: 5,
    comment: 'طراحی مینیمال و زیبا. کیفیت ساخت عالی است.',
    date: new Date('2024-02-01')
  },
  {
    id: '10',
    productId: '3',
    userName: 'زهرا محمدی',
    rating: 5,
    comment: 'ماگ مورد علاقه‌ام شد. هر روز از آن استفاده می‌کنم.',
    date: new Date('2024-01-28')
  },
  {
    id: '11',
    productId: '4',
    userName: 'حسین احمدی',
    rating: 5,
    comment: 'رنگ آبی روشن خیلی زیبا است. برای صبحانه عالی است.',
    date: new Date('2024-01-25')
  },
  {
    id: '12',
    productId: '4',
    userName: 'فاطمه کریمی',
    rating: 4,
    comment: 'کیفیت خوبی دارد. کمی کوچک است اما قابل قبول است.',
    date: new Date('2024-01-22')
  },
  {
    id: '13',
    productId: '5',
    userName: 'علی رضایی',
    rating: 5,
    comment: 'طراحی مدرن و زیبا. برای دکوراسیون عالی است.',
    date: new Date('2024-01-20')
  },
  {
    id: '14',
    productId: '5',
    userName: 'مریم صادقی',
    rating: 5,
    comment: 'کیفیت عالی و قیمت مناسب. کاملاً راضی هستم.',
    date: new Date('2024-01-18')
  },
  {
    id: '15',
    productId: '6',
    userName: 'محمد نوری',
    rating: 4,
    comment: 'رنگ سبز روشن خیلی زیبا است. برای محیط کار عالی است.',
    date: new Date('2024-01-15')
  },
  {
    id: '16',
    productId: '6',
    userName: 'سارا احمدی',
    rating: 5,
    comment: 'ماگ مورد علاقه‌ام شد. هر روز از آن استفاده می‌کنم.',
    date: new Date('2024-01-12')
  },
  {
    id: '17',
    productId: '7',
    userName: 'حسن کریمی',
    rating: 5,
    comment: 'طراحی کلاسیک و زیبا. کیفیت ساخت عالی است.',
    date: new Date('2024-01-10')
  },
  {
    id: '18',
    productId: '7',
    userName: 'فاطمه رضایی',
    rating: 4,
    comment: 'رنگ قرمز روشن خیلی زیبا است. برای صبحانه عالی است.',
    date: new Date('2024-01-08')
  },
  {
    id: '19',
    productId: '8',
    userName: 'رضا محمدی',
    rating: 5,
    comment: 'کیفیت عالی و قیمت مناسب. برای هدیه دادن عالی است.',
    date: new Date('2024-01-05')
  },
  {
    id: '20',
    productId: '8',
    userName: 'نرگس احمدی',
    rating: 5,
    comment: 'ماگ مورد علاقه‌ام شد. هر روز از آن استفاده می‌کنم.',
    date: new Date('2024-01-02')
  }
];

// Available mug images pool (add here if you upload more)
const mugImagesPool: string[] = [
  '/mugs/image.jpeg',
  '/mugs/image-3.jpeg',
  '/mugs/image-5.jpeg'
];

function getRandomImages(minCount: number = 2, maxCount: number = 4): string[] {
  const count = Math.max(minCount, Math.min(maxCount, Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount));
  const shuffled = [...mugImagesPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, mugImagesPool.length));
}

export const products: Product[] = [
  {
    id: '1',
    name: 'ماگ سرامیکی سفید کلاسیک',
    price: 18.99,
    image: '/mugs/image.jpeg',
    colors: ['سفید', 'مشکی', 'طوسی'],
    description: 'ماگ سرامیکی سفید و همیشه‌زیبا؛ مناسب برای قهوه صبحگاهی یا چای عصرانه.',
    category: 'کلاسیک',
    inStock: true,
    createdAt: new Date('2024-01-15'),
    popularity: 95,
    stockCount: 50,
    reviews: mockReviews.filter(r => r.productId === '1'),
    averageRating: 4.75,
    reviewCount: 4
  },
  {
    id: '2',
    name: 'ماگ قهوه‌ای روستیک',
    price: 22.50,
    image: '/mugs/image.jpeg',
    description: 'ماگ قهوه‌ای دست‌ساز با بافت منحصربه‌فرد و حس طبیعی.',
    category: 'روستیک',
    inStock: true,
    createdAt: new Date('2024-01-20'),
    popularity: 88,
    stockCount: 30,
    reviews: mockReviews.filter(r => r.productId === '2'),
    averageRating: 4.67,
    reviewCount: 3
  },
  {
    id: '3',
    name: 'ماگ مشکی مات مدرن',
    price: 24.99,
    salePrice: 19.99,
    image: '/mugs/image.jpeg',
    colors: ['مشکی', 'طوسی'],
    description: 'ماگ با روکش مشکی مات؛ انتخابی شیک برای دوستداران قهوه مدرن.',
    category: 'مدرن',
    inStock: true,
    createdAt: new Date('2024-02-01'),
    popularity: 92,
    stockCount: 25,
    reviews: mockReviews.filter(r => r.productId === '3'),
    averageRating: 4.67,
    reviewCount: 3
  },
  {
    id: '4',
    name: 'فنجان چای گلدار وینتیج',
    price: 26.75,
    image: '/mugs/image.jpeg',
    description: 'فنجان چای الهام‌گرفته از سبک قدیمی با طرح‌های گلدار ظریف.',
    category: 'وینتیج',
    inStock: true,
    createdAt: new Date('2024-01-25'),
    popularity: 78,
    stockCount: 3,
    reviews: mockReviews.filter(r => r.productId === '4'),
    averageRating: 4.5,
    reviewCount: 2
  },
  {
    id: '5',
    name: 'ست ماگ لعاب‌خورده دست‌ساز',
    price: 45.00,
    salePrice: 35.00,
    image: '/mugs/image.jpeg',
    colors: ['آبی', 'سبز', 'سفید'],
    description: 'ست دو عددی ماگ‌های دست‌ساز با لعاب زیبا.',
    category: 'ست‌ها',
    inStock: true,
    createdAt: new Date('2024-01-10'),
    popularity: 85,
    stockCount: 2,
    reviews: mockReviews.filter(r => r.productId === '5'),
    averageRating: 5.0,
    reviewCount: 2
  },
  {
    id: '6',
    name: 'ماگ شیشه‌ای مینیمال',
    price: 19.99,
    image: '/mugs/image.jpeg',
    colors: ['شفاف'],
    description: 'ماگ شیشه‌ای با طراحی مینیمال؛ مناسب برای نمایش زیبای نوشیدنی.',
    category: 'مدرن',
    inStock: false,
    reviews: mockReviews.filter(r => r.productId === '6'),
    averageRating: 4.5,
    reviewCount: 2
  }
  ,
  {
    id: '7',
    name: 'ماگ طرح سنگ مرمر',
    price: 27.90,
    image: '/mugs/image.jpeg',
    description: 'ترکیب ظرافت و دوام با طرح سنگ مرمر؛ مناسب محیط‌های مدرن.',
    category: 'مدرن',
    inStock: true,
    reviews: mockReviews.filter(r => r.productId === '7'),
    averageRating: 4.5,
    reviewCount: 2
  },
  {
    id: '8',
    name: 'ماگ دسته چوبی',
    price: 31.50,
    image: '/mugs/image.jpeg',
    description: 'ترکیب سرامیک و چوب طبیعی؛ حس روستیک و گرم.',
    category: 'روستیک',
    inStock: true,
    reviews: mockReviews.filter(r => r.productId === '8'),
    averageRating: 5.0,
    reviewCount: 2
  },
  {
    id: '9',
    name: 'فنجان نعلبکی کلاسیک طلایی',
    price: 39.00,
    image: '/mugs/image.jpeg',
    description: 'ست فنجان و نعلبکی با رگه‌های طلایی برای پذیرایی مجلسی.',
    category: 'کلاسیک',
    inStock: false
  },
  {
    id: '10',
    name: 'ست دو عددی ماگ مینیمال',
    price: 42.00,
    image: '/mugs/image.jpeg',
    description: 'دو ماگ ساده و کاربردی با رنگ‌های خنثی برای استفاده روزمره.',
    category: 'ست‌ها',
    inStock: true
  },
  {
    id: '11',
    name: 'فنجان گلریز وینتیج',
    price: 29.80,
    image: '/mugs/image.jpeg',
    description: 'فنجان ظریف با طرح گلریز الهام‌گرفته از سبک‌های کلاسیک.',
    category: 'وینتیج',
    inStock: true
  },
  {
    id: '12',
    name: 'ماگ دوبل‌یو جداره شیشه‌ای',
    price: 34.75,
    image: '/mugs/image.jpeg',
    description: 'شیشه دوجداره برای حفظ دما و جلوگیری از داغ شدن بدنه.',
    category: 'مدرن',
    inStock: true
  }
  ,
  {
    id: '13',
    name: 'ماگ طرح موج',
    price: 21.90,
    image: '/mugs/image.jpeg',
    description: 'ماگ با طرح موج‌های ظریف برای حس آرامش در هر جرعه.',
    category: 'مدرن',
    inStock: true
  },
  {
    id: '14',
    name: 'ماگ سفالی دست‌ساز',
    price: 23.40,
    image: '/mugs/image.jpeg',
    description: 'سفال دست‌ساز با رنگ‌های طبیعی و بافت دلنشین.',
    category: 'روستیک',
    inStock: true
  },
  {
    id: '15',
    name: 'ماگ کلاسیک لبه‌طلایی',
    price: 28.60,
    image: '/mugs/image.jpeg',
    description: 'لبه‌ طلایی برای جلوه‌ای شیک و کلاسیک.',
    category: 'کلاسیک',
    inStock: false
  },
  {
    id: '16',
    name: 'فنجان نعلبکی گلدار مینیمال',
    price: 26.20,
    image: '/mugs/image.jpeg',
    description: 'طرح گل‌های ساده برای طرفداران سادگی.',
    category: 'وینتیج',
    inStock: true
  },
  {
    id: '17',
    name: 'ست چهارتایی ماگ روزمره',
    price: 54.00,
    image: '/mugs/image.jpeg',
    description: 'چهار ماگ کاربردی برای خانواده یا محل کار.',
    category: 'ست‌ها',
    inStock: true
  },
  {
    id: '18',
    name: 'ماگ دسته ارگونومیک',
    price: 24.10,
    image: '/mugs/image.jpeg',
    description: 'دسته ارگونومیک برای گرفتن راحت‌تر و امن‌تر.',
    category: 'مدرن',
    inStock: true
  },
  {
    id: '19',
    name: 'ماگ بافت‌دار روستایی',
    price: 25.80,
    image: '/mugs/image.jpeg',
    description: 'بافت برجسته برای حس طبیعی و گرم.',
    category: 'روستیک',
    inStock: false
  },
  {
    id: '20',
    name: 'فنجان کلاسیک کافه‌ای',
    price: 19.50,
    image: '/mugs/image.jpeg',
    description: 'طراحی الهام‌گرفته از فنجان‌های کافه‌های قدیمی.',
    category: 'کلاسیک',
    inStock: true
  },
  {
    id: '21',
    name: 'ماگ مات مشکی با نعلبکی',
    price: 33.00,
    image: '/mugs/image.jpeg',
    description: 'ترکیب ماگ و نعلبکی برای سرو حرفه‌ای.',
    category: 'مدرن',
    inStock: true
  },
  {
    id: '22',
    name: 'ماگ لعاب ترک‌خورده هنری',
    price: 29.90,
    image: '/mugs/image.jpeg',
    description: 'افکت لعاب ترک برای جلوه‌ای هنری و خاص.',
    category: 'وینتیج',
    inStock: true
  },
  {
    id: '23',
    name: 'ست دو عددی کلاسیک سفید',
    price: 36.40,
    image: '/mugs/image.jpeg',
    description: 'دو عدد ماگ کلاسیک سفید برای هر سلیقه‌ای.',
    category: 'ست‌ها',
    inStock: true
  },
  {
    id: '24',
    name: 'ماگ طرح مرمر آبی',
    price: 27.20,
    image: '/mugs/image.jpeg',
    description: 'طرح مرمر آبی برای جلوه‌ای لوکس و مدرن.',
    category: 'مدرن',
    inStock: false
  },
  {
    id: '25',
    name: 'ماگ سفالی روستیک لبه‌ناهمگون',
    price: 22.80,
    image: '/mugs/image.jpeg',
    description: 'لبه‌های ناهمگون دست‌ساز با حس روستایی.',
    category: 'روستیک',
    inStock: true
  },
  {
    id: '26',
    name: 'فنجان کلاسیک نقش‌دار',
    price: 31.10,
    image: '/mugs/image.jpeg',
    description: 'نقش‌های کلاسیک برای مهمانی‌های رسمی.',
    category: 'کلاسیک',
    inStock: true
  },
  {
    id: '27',
    name: 'ماگ شیشه‌ای دوجداره مشکی',
    price: 35.60,
    image: '/mugs/image.jpeg',
    description: 'نمای جذاب نوشیدنی با جداره دوجداره.',
    category: 'مدرن',
    inStock: true
  },
  {
    id: '28',
    name: 'ماگ روستیک با نقش دست‌ساز',
    price: 26.30,
    image: '/mugs/image.jpeg',
    description: 'نقش‌های دستی برای حس پرجزئیات و گرم.',
    category: 'روستیک',
    inStock: false
  },
  {
    id: '29',
    name: 'فنجان و نعلبکی طلایی کلاسیک',
    price: 41.90,
    image: '/mugs/image.jpeg',
    description: 'ترکیب طلایی در سبک کلاسیک، مناسب پذیرایی مجلل.',
    category: 'کلاسیک',
    inStock: true
  },
  {
    id: '30',
    name: 'ست سه‌تایی ماگ مدرن',
    price: 59.00,
    image: '/mugs/image.jpeg',
    description: 'سه ماگ هماهنگ برای خانواده‌های کوچک.',
    category: 'ست‌ها',
    inStock: true
  },
  {
    id: '31',
    name: 'ماگ استیل با روکش مات',
    price: 32.80,
    image: '/mugs/image.jpeg',
    description: 'بدنه مقاوم با روکش مات برای استایل مدرن.',
    category: 'مدرن',
    inStock: true
  },
  {
    id: '32',
    name: 'ماگ سفالی ساده روستیک',
    price: 20.40,
    image: '/mugs/image.jpeg',
    description: 'سفالی ساده و کاربردی با حس روستایی دلنشین.',
    category: 'روستیک',
    inStock: true
  }
];

// Randomize images per product and update main image for variety
products.forEach((product, idx) => {
  const images = getRandomImages(2, 4);
  product.images = images;
  // Change main image for some products to increase variety
  if (idx % 2 === 0) {
    product.image = images[0];
  }
});

export const categories = ['همه', 'کلاسیک', 'مدرن', 'روستیک', 'وینتیج', 'ست‌ها'];