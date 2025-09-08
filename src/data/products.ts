import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic White Ceramic Mug',
    price: 18.99,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'A timeless white ceramic mug perfect for your morning coffee or afternoon tea.',
    category: 'Classic',
    inStock: true
  },
  {
    id: '2',
    name: 'Rustic Brown Coffee Mug',
    price: 22.50,
    image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Handcrafted rustic brown mug with a unique texture and earthy feel.',
    category: 'Rustic',
    inStock: true
  },
  {
    id: '3',
    name: 'Modern Black Matte Mug',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1251176/pexels-photo-1251176.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Sleek black matte finish mug for the modern coffee enthusiast.',
    category: 'Modern',
    inStock: true
  },
  {
    id: '4',
    name: 'Vintage Floral Tea Cup',
    price: 26.75,
    image: 'https://images.pexels.com/photos/1251177/pexels-photo-1251177.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Elegant vintage-inspired tea cup with delicate floral patterns.',
    category: 'Vintage',
    inStock: true
  },
  {
    id: '5',
    name: 'Artisan Glazed Mug Set',
    price: 45.00,
    image: 'https://images.pexels.com/photos/1251178/pexels-photo-1251178.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Set of two artisan-crafted mugs with beautiful glazed finish.',
    category: 'Sets',
    inStock: true
  },
  {
    id: '6',
    name: 'Minimalist Glass Mug',
    price: 19.99,
    image: 'https://images.pexels.com/photos/1251179/pexels-photo-1251179.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Clear glass mug with minimalist design, perfect for showcasing your beverage.',
    category: 'Modern',
    inStock: false
  }
];

export const categories = ['All', 'Classic', 'Modern', 'Rustic', 'Vintage', 'Sets'];