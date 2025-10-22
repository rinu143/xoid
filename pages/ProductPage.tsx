

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Product, Review } from '../types';
import { useCart, useWishlist, useProducts } from '../App';
import { reviews as allReviews } from '../data/reviews';
import ProductReviews from '../components/ProductReviews';
import ReviewForm from '../components/ReviewForm';
import SimilarProducts from '../components/SimilarProducts';
import { useToast } from '../components/ToastProvider';
import StarRating from '../components/StarRating';

const SizeStockDisplay: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock === 0) {
    return <p className="text-sm font-bold text-red-600">Out of Stock</p>;
  }
  if (stock <= 5) {
    return <p className="text-sm font-bold text-yellow-600">Only {stock} left!</p>;
  }
  return <p className="text-sm font-bold text-green-600">In Stock</p>;
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const { addToCart, buyNow } = useCart();
  const { isProductInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === parseInt(id || ''));
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addToCartError, setAddToCartError] = useState<string | null>(null);
  const [addToCartState, setAddToCartState] = useState<'idle' | 'success'>('idle');


  const colorMap: { [key: string]: string } = {
    'Black': '#111827',
    'White': '#ffffff',
    'Cream': '#F3EFE9',
    'Light Blue': '#A7D5E1'
  };


  useEffect(() => {
    if (product) {
      const productReviews = allReviews.filter(review => review.productId === product.id);
      setReviews(productReviews);
    }
    setCurrentImageIndex(0); // Reset image on product change
    setActiveTab('details'); // Reset tab on product change
    setSelectedSize(null);
    setAddToCartError(null);
  }, [product]);

  const handleNextImage = useCallback(() => {
    if (!product) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.imageUrls.length);
  }, [product]);

  const handlePrevImage = useCallback(() => {
    if (!product) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.imageUrls.length) % product.imageUrls.length);
  }, [product]);

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }
  
  const sizeStock = product.sizeStock;
  const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;
  const isInWishlist = isProductInWishlist(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    if (!product || addToCartState === 'success') return;
    if (!selectedSize) {
      setAddToCartError('Please select a size.');
      // Scroll to the size selection section
      document.getElementById('size-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setAddToCartError(null);
    addToCart(product, 1, selectedSize);
    setAddToCartState('success');
    setTimeout(() => {
      setAddToCartState('idle');
    }, 2000);
  };
  
  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize) {
        setAddToCartError('Please select a size.');
        document.getElementById('size-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    setAddToCartError(null);
    buyNow(product, 1, selectedSize);
  };
  
  const handleVirtualTryOn = () => {
    if (!product) return;
    navigate(`/virtual-try-on/${product.id}`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };
  
  const handleAddReview = ({ rating, comment }: { rating: number; comment: string }) => {
    const newReview: Review = {
      id: Date.now(),
      productId: product.id,
      author: 'Guest User',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews(prevReviews => [newReview, ...prevReviews]);
    addToast('Thank you for your review!');
  };

  const currentImageUrl = product.imageUrls[currentImageIndex];

  const TabButton: React.FC<{tabName: 'details' | 'reviews'; label: string}> = ({ tabName, label }) => (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
          activeTab === tabName
            ? 'border-black text-black'
            : 'border-transparent text-gray-500 hover:border-gray-400 hover:text-gray-700'
        }`}
      >
        {label}
      </button>
  );
  
  const isOutOfStock = product.stock === 0;

  return (
    <div className="container mx-auto pb-32 lg:pb-0">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        {/* Image gallery */}
        <div className="lg:sticky top-24">
           <div className="relative group">
             <div 
               className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100"
               onMouseEnter={() => setIsZooming(true)}
               onMouseLeave={() => setIsZooming(false)}
               onMouseMove={handleMouseMove}
             >
               <img 
                 src={currentImageUrl} 
                 alt={`${product.name} view ${currentImageIndex + 1}`}
                 className="w-full h-full object-center object-cover transition-transform duration-300 ease-in-out"
                 style={{
                   transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                   transform: isZooming ? 'scale(1.5)' : 'scale(1)',
                 }}
               />
             </div>
             {product.imageUrls.length > 1 && (
                <>
                    <button
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/50 p-2 rounded-full text-black hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNextImage}
                        aria-label="Next image"
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/50 p-2 rounded-full text-black hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
             )}
           </div>
           {/* Thumbnails */}
           <div className="mt-4 grid grid-cols-5 gap-4">
              {product.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black ${currentImageIndex === index ? 'ring-2 ring-black' : 'opacity-75 hover:opacity-100'}`}
                >
                  <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-center object-cover" />
                </button>
              ))}
           </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">{product.name}</h1>

          <div className="mt-4">
            <p className="text-3xl text-gray-700">₹{product.price}</p>
          </div>

          <div className="mt-6">
            {reviews.length > 0 ? (
                <div className="flex items-center">
                    <StarRating rating={averageRating} />
                    <a 
                      href="#reviews-section" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setActiveTab('reviews'); 
                        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' }); 
                      }} 
                      className="ml-3 text-sm font-medium text-black hover:underline"
                    >
                        {reviews.length} review{reviews.length > 1 ? 's' : ''}
                    </a>
                </div>
            ) : (
                <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
          </div>

           <div className="mt-6 border-t border-gray-200 pt-6">
             <h3 className="text-sm font-medium text-black">Color</h3>
             <div className="mt-2 flex items-center gap-2">
                {product.colors.map(color => (
                    <span
                        key={color}
                        className="h-8 w-8 rounded-full border-2 border-black block"
                        style={{ backgroundColor: colorMap[color] || color.toLowerCase() }}
                        title={color}
                    ></span>
                ))}
             </div>
           </div>

           {/* Size selector */}
           <div className="mt-8" id="size-selector">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-black">Size</h3>
                </div>

                <fieldset className="mt-4">
                  <legend className="sr-only">Choose a size</legend>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => {
                       const isSizeOutOfStock = sizeStock[size] === 0;
                       return (
                          <label
                            key={size}
                            className={`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase transition-colors ${
                              isSizeOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 focus:outline-none cursor-pointer'
                            } ${
                              selectedSize === size
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-gray-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="size-choice"
                              value={size}
                              className="sr-only"
                              onChange={() => {
                                setSelectedSize(size);
                                setAddToCartError(null);
                              }}
                              aria-labelledby={`size-choice-${size}-label`}
                              disabled={isSizeOutOfStock}
                            />
                            <span id={`size-choice-${size}-label`}>{size}</span>
                            {isSizeOutOfStock && (
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                >
                                    <svg
                                        className="absolute inset-0 h-full w-full stroke-2 text-gray-300"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        stroke="currentColor"
                                    >
                                        <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                    </svg>
                                </span>
                            )}
                          </label>
                       );
                    })}
                  </div>
                </fieldset>
            </div>
            
            <div className="mt-4 h-6">
                {selectedSize && sizeStock[selectedSize] !== undefined && (
                    <SizeStockDisplay stock={sizeStock[selectedSize]} />
                )}
            </div>

            <div className="mt-6 flex flex-col gap-4">
                {addToCartError && <p className="text-sm text-center text-red-600">{addToCartError}</p>}

                {/* Primary Action Row: Add to Cart + Wishlist (Desktop Only) */}
                <div className="hidden lg:flex items-stretch gap-3">
                    <button
                        onClick={handleAddToCart}
                        type="button"
                        disabled={isOutOfStock}
                        className="relative flex-1 bg-black border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-base font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 ease-in-out transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed overflow-hidden"
                    >
                        <span className={`transition-transform duration-300 ease-in-out flex items-center justify-center ${addToCartState === 'idle' ? 'translate-y-0' : '-translate-y-12'}`}>
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </span>
                        <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${addToCartState === 'success' ? 'translate-y-0' : 'translate-y-12'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Added to Cart!
                        </span>
                    </button>
                    <button
                        onClick={handleWishlistToggle}
                        type="button"
                        disabled={isOutOfStock}
                        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={`flex-shrink-0 w-16 flex items-center justify-center rounded-md border py-4 px-4 text-base font-bold transition-all duration-200 ease-in-out transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-300 text-black hover:bg-gray-100'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                <button
                    onClick={handleBuyNow}
                    type="button"
                    disabled={isOutOfStock}
                    className="w-full bg-black border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-base font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 ease-in-out transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Buy It Now
                </button>
                
                <button
                    onClick={handleVirtualTryOn}
                    type="button"
                    disabled={isOutOfStock}
                    className="shine-effect w-full bg-white border border-gray-300 rounded-md py-4 px-8 flex items-center justify-center text-base font-bold text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 ease-in-out transform active:scale-95 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center">
                        Virtual Try-On
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 ai-star-sparkle" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0L14.24 9.76L24 12L14.24 14.24L12 24L9.76 14.24L0 12L9.76 9.76L12 0Z" />
                        </svg>
                    </span>
                </button>
            </div>

          {/* Social Share Section */}
          <div className="mt-8 text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-800">Share</h3>
            <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2">
                {/* WhatsApp Button */}
                <a 
                    href={`https://api.whatsapp.com/send?text=Check%20out%20this%20ZOID%20tee%3A%20${encodeURIComponent(product.name)}%20-%20${encodeURIComponent(window.location.href)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-black transition-colors"
                    aria-label="Share on WhatsApp"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.654 4.288 1.902 6.129L6.595 20.19zM11.56 9.492c-.152-.076-.887-.438-1.024-.487-.137-.05-.236-.076-.335.076-.1.152-.387.487-.474.586-.087.1-.174.114-.311.038-.137-.076-.578-.214-1.101-.679-.407-.364-.679-.818-.766-.966-.087-.148-.009-.23.067-.307.067-.067.152-.174.228-.262.076-.087.101-.152.152-.261.051-.1-.025-.189-.076-.262-.05-.076-.335-.794-.459-.967-.122-.172-.244-.147-.335-.151-.09-.004-.188-.004-.287-.004-.1 0-.262.038-.399.188-.137.152-.524.512-.524 1.247 0 .734.539 1.447.614 1.546.076.1.048.69.614 1.223.754.709 1.189.874 1.639.995.321.088.586.075.787.046.224-.033.708-.288.807-.569.099-.28.099-.538.07-.568-.029-.03-.099-.047-.198-.095z"/>
                    </svg>
                </a>
                {/* Copy Link Button */}
                <div className="relative flex items-center">
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            addToast('Link copied to clipboard!');
                        }}
                        className="text-gray-500 hover:text-black transition-colors"
                        aria-label="Copy product link"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                    </button>
                </div>
            </div>
          </div>
          
          {/* Tabs Section */}
            <div className="mt-12" id="reviews-section">
                <div className="border-b border-gray-200">
                    <div className="-mb-px flex space-x-8" aria-label="Tabs">
                        <TabButton tabName="details" label="Details & Fit" />
                        <TabButton tabName="reviews" label={`Reviews (${reviews.length})`} />
                    </div>
                </div>
                <div className="mt-8">
                    {activeTab === 'details' && (
                        <div>
                            <h3 className="text-xl font-semibold text-black">Description</h3>
                            <div className="mt-4 prose text-gray-600 max-w-none">
                                <p>{product.description}</p>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-black">Fit & Sizing</h3>
                                <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
                                    <li>Designed for a deliberately oversized fit.</li>
                                    <li>Dropped shoulders for a relaxed silhouette.</li>
                                    <li>Consider sizing down for a closer fit.</li>
                                </ul>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-black">Fabric & Care</h3>
                                <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
                                    <li>Material: {product.material}</li>
                                    <li>Machine wash cold, inside out.</li>
                                    <li>Tumble dry low or hang dry to preserve quality.</li>
                                    <li>Do not iron directly on graphics.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div>
                            <ProductReviews reviews={reviews} />
                            <ReviewForm onSubmit={handleAddReview} />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* --- Sticky Add to Cart Bar for Mobile --- */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-stretch gap-3">
            <button
                onClick={handleWishlistToggle}
                type="button"
                disabled={isOutOfStock}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`flex-shrink-0 w-14 flex items-center justify-center rounded-md border py-3 px-3 text-base font-bold transition-all duration-200 ease-in-out transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-300 text-black hover:bg-gray-100'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
            <button
                onClick={handleAddToCart}
                type="button"
                disabled={isOutOfStock}
                className="relative flex-1 bg-black border border-transparent rounded-md py-3 px-6 flex items-center justify-center text-base font-bold text-white hover:bg-gray-800 transition-all duration-200 ease-in-out transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed overflow-hidden"
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
          </div>
        </div>
      </div>

      <SimilarProducts currentProductId={product.id} />
    </div>
  );
};

export default ProductPage;
