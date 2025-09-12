import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    price: Joi.number().required().min(0),
    salePrice: Joi.number().min(0).optional(),
    description: Joi.string().required().min(10).max(1000),
    category: Joi.string().required().valid('کلاسیک', 'مدرن', 'روستیک', 'وینتیج', 'ست‌ها'),
    image: Joi.string().required(),
    images: Joi.array().items(Joi.string()).optional(),
    colors: Joi.array().items(Joi.string()).optional(),
    inStock: Joi.boolean().default(true),
    stockCount: Joi.number().min(0).optional(),
    sku: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    popularity: Joi.number().min(0).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'داده‌های ورودی نامعتبر', 
      details: error.details.map(d => d.message) 
    });
  }

  next();
};

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).optional(),
    phone: Joi.string().pattern(/^09\d{9}$/).optional(),
    role: Joi.string().valid('admin', 'staff', 'readonly', 'customer').optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'داده‌های ورودی نامعتبر', 
      details: error.details.map(d => d.message) 
    });
  }

  next();
};

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled').optional(),
    trackingNumber: Joi.string().optional(),
    notes: Joi.string().max(500).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'داده‌های ورودی نامعتبر', 
      details: error.details.map(d => d.message) 
    });
  }

  next();
};