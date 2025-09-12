import { Request, Response } from 'express';
import path from 'path';

export const uploadImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'فایل تصویر الزامی است' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.status(201).json({
      message: 'تصویر با موفقیت آپلود شد',
      imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'خطای آپلود تصویر' });
  }
};

export const uploadMultipleImages = (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'حداقل یک فایل تصویر الزامی است' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    
    res.status(201).json({
      message: 'تصاویر با موفقیت آپلود شدند',
      imageUrls,
      files: req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      }))
    });
  } catch (error) {
    console.error('Upload multiple images error:', error);
    res.status(500).json({ message: 'خطای آپلود تصاویر' });
  }
};