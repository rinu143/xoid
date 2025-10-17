import React from 'react';
import { Review } from '../types';
import StarRating from './StarRating';

interface ProductReviewsProps {
  reviews: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="mt-10 pt-10 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-black mb-4">Customer Reviews</h3>
        <p className="text-gray-600">No reviews yet. Be the first to write one!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="mt-10 pt-10 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-black mb-4">Customer Reviews</h3>
      <div className="flex items-center mb-6">
        <StarRating rating={averageRating} />
        <p className="ml-2 text-sm text-gray-600">
          Based on {reviews.length} review{reviews.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col space-y-2">
            <div className="flex items-center">
                <StarRating rating={review.rating} />
                <p className="ml-3 font-semibold text-black">{review.author}</p>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;