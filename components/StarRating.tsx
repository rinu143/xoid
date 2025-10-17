import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: string;
}

const Star: React.FC<{ filled: boolean; onClick?: () => void; onMouseEnter?: () => void; onMouseLeave?: () => void; size: string; }> = ({ filled, onClick, onMouseEnter, onMouseLeave, size }) => (
  <svg
    className={`${size} ${filled ? 'text-black' : 'text-gray-300'} ${onClick ? 'cursor-pointer' : ''}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, size = 'h-5 w-5' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const isInteractive = !!onRatingChange;

  return (
    <div className="flex items-center" onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          filled={(hoverRating || rating) >= star}
          onClick={isInteractive ? () => onRatingChange(star) : undefined}
          onMouseEnter={isInteractive ? () => setHoverRating(star) : undefined}
        />
      ))}
    </div>
  );
};

export default StarRating;