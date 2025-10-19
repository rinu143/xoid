import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useWishlist } from '../App';

interface ProductCardProps {
  product: Product;
  onQuickViewClick?: (product: Product) => void;
}

const WishlistButton: React.FC<{ product: Product }> = ({ product }) => {
    const { isProductInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const isInWishlist = isProductInWishlist(product.id);

    const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product.id);
        }
    };

    return (
        <button
            onClick={handleWishlistToggle}
            className={`absolute top-4 right-4 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 ease-in-out transform active:scale-95 ${isInWishlist ? 'scale-100 text-red-500' : 'scale-0 group-hover:scale-100 text-black hover:text-red-500'}`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
};

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
        
        {/* Wishlist Button - Placed here to be on top and control its own visibility */}
        {!isOutOfStock && <WishlistButton product={product} />}

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
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-end justify-center p-4">
            {/* Quick View Button */}
            <button
              onClick={handleButtonClick}
              className="w-full bg-white text-black font-bold py-3 px-8 rounded-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-in-out active:scale-95"
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