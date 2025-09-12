import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types/index.js';

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['کلاسیک', 'مدرن', 'روستیک', 'وینتیج', 'ست‌ها']
  },
  image: { type: String, required: true },
  images: [{ type: String }],
  colors: [{ type: String }],
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, min: 0 },
  sku: { type: String, unique: true, sparse: true },
  slug: { type: String, unique: true },
  tags: [{ type: String }],
  popularity: { type: Number, default: 0 },
  averageRating: { type: Number, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    // For Persian names, create a simple slug
    this.slug = this.name
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    
    // If slug is empty after processing Persian characters, use a fallback
    if (!this.slug) {
      this.slug = `product-${this._id}`;
    }
  }
  next();
});

// Update averageRating when reviews change
productSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ productId: this._id, isApproved: true });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    this.averageRating = totalRating / reviews.length;
    this.reviewCount = reviews.length;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }
  
  await this.save();
};

export default mongoose.model<IProduct>('Product', productSchema);