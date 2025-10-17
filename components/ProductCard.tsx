import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickViewClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickViewClick }) => {
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the Link navigation when clicking the button
    e.preventDefault();
    e.stopPropagation();
    if (onQuickViewClick) {
      onQuickViewClick(product);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-md">
        {/* Product Image */}
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out ${!isOutOfStock ? 'group-hover:scale-105' : 'grayscale'}`}
        />

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <span className="font-bold text-black tracking-widest uppercase text-sm">Out of Stock</span>
          </div>
        )}
        
        {/* Hover Effect Container */}
        {onQuickViewClick && !isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
            {/* Quick View Button */}
            <button
              onClick={handleButtonClick}
              className="bg-white text-black font-bold py-3 px-8 rounded-md opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 ease-in-out"
              aria-label={`Quick view for ${product.name}`}
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-800 font-medium">{product.name}</h3>
        </div>
        <p className="text-sm font-semibold text-gray-600">${product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
