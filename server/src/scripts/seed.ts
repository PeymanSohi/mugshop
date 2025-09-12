import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import { connectDB } from '../config/database.js';

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({})
    ]);

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      name: 'مدیر سیستم',
      email: 'admin@mugshop.com',
      password: adminPassword,
      role: 'admin',
      phone: '09123456789'
    });

    // Create staff user
    const staffPassword = await bcrypt.hash('staff123', 12);
    const staffUser = await User.create({
      name: 'کارمند فروشگاه',
      email: 'staff@mugshop.com',
      password: staffPassword,
      role: 'staff',
      phone: '09123456788'
    });

    console.log('👤 Created admin and staff users');

    // Create categories
    const categories = await Category.create([
      { name: 'کلاسیک', sortOrder: 1 },
      { name: 'مدرن', sortOrder: 2 },
      { name: 'روستیک', sortOrder: 3 },
      { name: 'وینتیج', sortOrder: 4 },
      { name: 'ست‌ها', sortOrder: 5 }
    ]);

    console.log('📂 Created categories');

    // Create sample products
    const products = await Product.create([
      {
        name: 'ماگ سرامیکی سفید کلاسیک',
        price: 18.99,
        description: 'ماگ سرامیکی سفید و همیشه‌زیبا؛ مناسب برای قهوه صبحگاهی یا چای عصرانه.',
        category: 'کلاسیک',
        image: '/mugs/image.jpeg',
        colors: ['سفید', 'مشکی', 'طوسی'],
        inStock: true,
        stockCount: 50,
        popularity: 95,
        sku: 'MUG-CLS-001'
      },
      {
        name: 'ماگ قهوه‌ای روستیک',
        price: 22.50,
        description: 'ماگ قهوه‌ای دست‌ساز با بافت منحصربه‌فرد و حس طبیعی.',
        category: 'روستیک',
        image: '/mugs/image-3.jpeg',
        inStock: true,
        stockCount: 30,
        popularity: 88,
        sku: 'MUG-RST-001'
      },
      {
        name: 'ماگ مشکی مات مدرن',
        price: 24.99,
        salePrice: 19.99,
        description: 'ماگ با روکش مشکی مات؛ انتخابی شیک برای دوستداران قهوه مدرن.',
        category: 'مدرن',
        image: '/mugs/image-5.jpeg',
        colors: ['مشکی', 'طوسی'],
        inStock: true,
        stockCount: 25,
        popularity: 92,
        sku: 'MUG-MOD-001'
      },
      {
        name: 'فنجان چای گلدار وینتیج',
        price: 26.75,
        description: 'فنجان چای الهام‌گرفته از سبک قدیمی با طرح‌های گلدار ظریف.',
        category: 'وینتیج',
        image: '/mugs/image.jpeg',
        inStock: true,
        stockCount: 15,
        popularity: 78,
        sku: 'CUP-VNT-001'
      },
      {
        name: 'ست ماگ لعاب‌خورده دست‌ساز',
        price: 45.00,
        salePrice: 35.00,
        description: 'ست دو عددی ماگ‌های دست‌ساز با لعاب زیبا.',
        category: 'ست‌ها',
        image: '/mugs/image-3.jpeg',
        colors: ['آبی', 'سبز', 'سفید'],
        inStock: true,
        stockCount: 10,
        popularity: 85,
        sku: 'SET-HND-001'
      }
    ]);

    console.log('🏺 Created sample products');

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customer = await User.create({
      name: 'مشتری نمونه',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'customer',
      phone: '09123456787',
      addresses: [{
        type: 'home',
        title: 'خانه',
        fullName: 'مشتری نمونه',
        phone: '09123456787',
        address: 'خیابان ولیعصر، پلاک ۱۲۳',
        city: 'تهران',
        province: 'تهران',
        postalCode: '1234567890',
        isDefault: true
      }]
    });

    // Create sample orders
    await Order.create([
      {
        userId: customer._id.toString(),
        items: [
          {
            productId: products[0]._id.toString(),
            name: products[0].name,
            price: products[0].price,
            quantity: 2,
            image: products[0].image
          }
        ],
        subtotal: products[0].price * 2,
        shippingCost: 5,
        total: (products[0].price * 2) + 5,
        status: 'delivered',
        paymentMethod: 'online',
        paymentStatus: 'paid',
        shippingAddress: customer.addresses![0],
        trackingNumber: 'TRK123456789'
      },
      {
        userId: customer._id.toString(),
        items: [
          {
            productId: products[2]._id.toString(),
            name: products[2].name,
            price: products[2].salePrice || products[2].price,
            quantity: 1,
            image: products[2].image
          }
        ],
        subtotal: products[2].salePrice || products[2].price,
        shippingCost: 0,
        total: products[2].salePrice || products[2].price,
        status: 'pending',
        paymentMethod: 'online',
        paymentStatus: 'pending',
        shippingAddress: customer.addresses![0]
      }
    ]);

    console.log('🛒 Created sample orders');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('Email: admin@mugshop.com');
    console.log('Password: admin123');
    console.log('\n📋 Staff Credentials:');
    console.log('Email: staff@mugshop.com');
    console.log('Password: staff123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();