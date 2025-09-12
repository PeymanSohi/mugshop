import mongoose, { Schema } from 'mongoose';
import { IReview } from '../types/index.js';

const reviewSchema = new Schema<IReview>({
  productId: { type: String, required: true },
  userId: { type: String },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ productId: 1, isApproved: 1 });
reviewSchema.index({ createdAt: -1 });

export default mongoose.model<IReview>('Review', reviewSchema);