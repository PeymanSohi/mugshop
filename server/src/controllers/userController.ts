import { Request, Response } from 'express';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      search,
      isActive
    } = req.query;

    const filter: any = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { password, ...updateData } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    res.json({ 
      message: 'کاربر با موفقیت به‌روزرسانی شد', 
      user 
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    // Prevent deactivating self
    if (user._id.toString() === req.user!.id) {
      return res.status(400).json({ message: 'نمی‌توانید خودتان را غیرفعال کنید' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `کاربر ${user.isActive ? 'فعال' : 'غیرفعال'} شد`, 
      user: { ...user.toJSON() }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user!.id) {
      return res.status(400).json({ message: 'نمی‌توانید خودتان را حذف کنید' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'کاربر با موفقیت حذف شد' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};