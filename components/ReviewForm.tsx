import React, { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string }) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (comment.trim() === '') {
        setError('Please write a comment.');
        return;
    }
    setError('');
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className="mt-10 pt-10 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-black mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <StarRating rating={rating} onRatingChange={setRating} size="h-6 w-6" />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Your Review
          </label>
          <div className="mt-1">
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-black focus:ring-0 focus:outline-none sm:text-sm p-2 text-black"
              placeholder="Share your thoughts on the product..."
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;