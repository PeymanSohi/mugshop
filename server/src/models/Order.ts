import mongoose, { Schema } from 'mongoose';
import { IOrder, IOrderItem, IAddress } from '../types/index.js';

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true }
});

const addressSchema = new Schema<IAddress>({
  type: { type: String, enum: ['home', 'work', 'other'], required: true },
  title: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const orderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  shippingCost: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'online'],
    required: true
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  shippingAddress: { type: addressSchema, required: true },
  trackingNumber: { type: String },
  notes: { type: String }
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.orderNumber = `MUG${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);