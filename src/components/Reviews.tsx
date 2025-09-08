import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, averageRating, reviewCount }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
        </div>
        <span className="text-gray-600">({reviewCount} نظر)</span>
      </div>

      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{review.userName}</span>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>هنوز نظری برای این محصول ثبت نشده است.</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
