import { Request, Response } from 'express';
import Order from '../models/Order.js';
import { AuthRequest } from '../types/index.js';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      paymentStatus,
      search,
      startDate,
      endDate
    } = req.query;

    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, trackingNumber, notes },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    res.json({ 
      message: 'وضعیت سفارش با موفقیت به‌روزرسانی شد', 
      order 
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalOrders,
      todayOrders,
      monthlyOrders,
      pendingOrders,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { 
          $match: { 
            status: { $in: ['delivered', 'shipped'] },
            createdAt: { $gte: startOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    res.json({
      totalOrders,
      todayOrders,
      monthlyOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};