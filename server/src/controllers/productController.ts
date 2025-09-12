import { Request, Response } from 'express';
import Product from '../models/Product.js';
import { AuthRequest } from '../types/index.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      inStock, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter: any = {};
    
    if (category && category !== 'همه') {
      filter.category = category;
    }
    
    if (inStock !== undefined) {
      filter.inStock = inStock === 'true';
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({ 
      message: 'محصول با موفقیت ایجاد شد', 
      product 
    });
  } catch (error) {
    console.error('Create product error:', error);
    if ((error as any).code === 11000) {
      return res.status(400).json({ message: 'محصولی با این SKU قبلاً وجود دارد' });
    }
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    res.json({ 
      message: 'محصول با موفقیت به‌روزرسانی شد', 
      product 
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    res.json({ message: 'محصول با موفقیت حذف شد' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const toggleProductStatus = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({ 
      message: `محصول ${product.isActive ? 'فعال' : 'غیرفعال'} شد`, 
      product 
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};