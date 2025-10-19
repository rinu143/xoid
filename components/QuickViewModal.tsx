import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { useCart, useWishlist } from '../App';
import { Link } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

const StockDisplay: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock === 0) {
    return <p className="text-sm font-medium text-red-600">Out of Stock</p>;
  }
  if (stock <= 5) {
    return <p className="text-sm font-medium text-yellow-600">Only {stock} left!</p>;
  }
  return <p className="text-sm font-medium text-green-600">In Stock</p>;
};


const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isProductInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addToCartState, setAddToCartState] = useState<'idle' | 'success'>('idle');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => el.offsetParent !== null);
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);


  const isInWishlist = isProductInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size.');
      return;
    }
    if (addToCartState === 'success') return;

    setError(null);
    addToCart(product, quantity, selectedSize);
    setAddToCartState('success');
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };
  
  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const currentImageUrl = product.imageUrls[currentImageIndex];
  const isOutOfStock = product.stock === 0;
  const titleId = `qvm-title-${product.id}`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[70] p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-white rounded-lg w-full max-w-5xl max-h-[95vh] flex flex-col md:flex-row overflow-hidden border border-gray-200"
        onClick={handleModalContentClick}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors z-20 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Gallery */}
        <div className="md:w-1/2 w-full p-4 sm:p-6 flex flex-col">
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 flex-grow">
                <img
                    src={currentImageUrl}
                    alt={`${product.name} view ${currentImageIndex + 1}`}
                    className="w-full h-full object-center object-cover"
                />
            </div>
            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-4">
                {product.imageUrls.map((url, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black ${currentImageIndex === index ? 'ring-2 ring-black' : 'opacity-75 hover:opacity-100'}`}
                        aria-label={`View image ${index + 1} of ${product.name}`}
                    >
                        <img src={url} alt="" className="w-full h-full object-center object-cover" />
                    </button>
                ))}
            </div>
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2 w-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-start gap-4">
              <h2 id={titleId} className="text-3xl font-black tracking-tight text-black">{product.name}</h2>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
                <p className="text-3xl text-gray-700">${product.price}</p>
                <StockDisplay stock={product.stock} />
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
                 <h3 className="text-sm font-medium text-black">Description</h3>
                 <p className="mt-2 text-sm text-gray-600">{product.description}</p>
            </div>
            
            <div className="mt-6">
                 <h3 className="text-sm font-medium text-black">Details</h3>
                 <div className="mt-2 flex flex-col text-sm text-gray-600 space-y-1">
                     <span>Color: {product.color}</span>
                     <span>Material: {product.material}</span>
                 </div>
            </div>

            {/* Size Selector */}
             <div className="mt-6">
                <h3 className="text-sm font-medium text-black">Size</h3>
                <fieldset className="mt-2">
                  <legend className="sr-only">Choose a size</legend>
                  <div className="grid grid-cols-4 gap-3">
                    {product.sizes.map((size) => (
                       <label
                        key={size}
                        className={`group relative border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus-within:ring-2 focus-within:ring-black cursor-pointer transition-colors ${
                          selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="size-choice-modal"
                          value={size}
                          className="sr-only"
                          onChange={() => {
                            setSelectedSize(size);
                            setError(null);
                          }}
                          aria-labelledby={`size-choice-modal-${size}-label`}
                           disabled={isOutOfStock}
                        />
                        <span id={`size-choice-modal-${size}-label`}>{size}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

          </div>

          <div className="mt-8">
            {!isOutOfStock && (
                <div className="flex items-center space-x-4 mb-6">
                    <label htmlFor="quantity" className="text-sm font-medium text-black">Quantity</label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black"
                            aria-label="Decrease quantity"
                        >
                            &ndash;
                        </button>
                        <span className="px-4 py-2 text-black font-medium" aria-live="polite">{quantity}</span>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}
             {error && <p className="text-sm text-red-600 mb-2 text-center">{error}</p>}
            <div className="flex gap-4">
                 <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addToCartState === 'success'}
                  className="relative flex-1 w-full h-12 bg-black text-white font-bold px-6 rounded-md hover:bg-gray-800 transition-all duration-200 ease-in-out transform active:scale-95 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  <span className={`transition-transform duration-300 ease-in-out flex items-center justify-center ${addToCartState === 'idle' ? 'translate-y-0' : '-translate-y-12'}`}>
                     {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${addToCartState === 'success' ? 'translate-y-0' : 'translate-y-12'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Added!
                  </span>
                </button>
                 <button
                    onClick={handleWishlistToggle}
                    type="button"
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-md border transition-all duration-200 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black ${isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-300 text-black hover:bg-gray-100'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="mt-4 block text-center w-full text-black font-medium hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-black rounded"
            >
              View Full Product Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;