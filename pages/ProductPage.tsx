import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Product, Review } from '../types';
import { useCart } from '../App';
import { reviews as allReviews } from '../data/reviews';
import ProductReviews from '../components/ProductReviews';
import ReviewForm from '../components/ReviewForm';
import SimilarProducts from '../components/SimilarProducts';
import { useToast } from '../components/ToastProvider';

interface ProductPageProps {
  products: Product[];
}

const StockDisplay: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock === 0) {
    return <p className="text-sm font-bold text-red-600">Out of Stock</p>;
  }
  if (stock <= 5) {
    return <p className="text-sm font-bold text-yellow-600">Only {stock} left!</p>;
  }
  return <p className="text-sm font-bold text-green-600">In Stock</p>;
};

const ProductPage: React.FC<ProductPageProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, clearCart } = useCart();
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
    window.scrollTo(0, 0); // Scroll to top on product change
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      setAddToCartError('Please select a size.');
      return;
    }
    setAddToCartError(null);
    addToCart(product, 1, selectedSize);
  };
  
  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize) {
        setAddToCartError('Please select a size.');
        return;
    }
    setAddToCartError(null);
    clearCart();
    addToCart(product, 1, selectedSize);
    navigate('/checkout');
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
    <div className="container mx-auto">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        {/* Image gallery */}
        <div className="sticky top-24">
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
          <h1 className="text-4xl font-black tracking-tight text-black">{product.name}</h1>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-3xl text-gray-700">${product.price}</p>
            <StockDisplay stock={product.stock} />
          </div>

           <div className="mt-6 border-t border-gray-200 pt-6">
             <h3 className="text-sm font-medium text-black">Color</h3>
             <div className="mt-2">
                <span
                    className="h-8 w-8 rounded-full border-2 border-black block"
                    style={{ backgroundColor: colorMap[product.color] || product.color.toLowerCase() }}
                    title={product.color}
                ></span>
             </div>
           </div>

           {/* Size selector */}
           <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-black">Size</h3>
                </div>

                <fieldset className="mt-4">
                  <legend className="sr-only">Choose a size</legend>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                    {product.sizes.map((size) => (
                      <label
                        key={size}
                        className={`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none cursor-pointer transition-colors ${
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
                          disabled={isOutOfStock}
                        />
                        <span id={`size-choice-${size}-label`}>{size}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
            </div>


            <div className="mt-10 space-y-4">
              {addToCartError && <p className="text-sm text-center text-red-600">{addToCartError}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                      onClick={handleAddToCart}
                      type="button"
                      disabled={isOutOfStock}
                      className="w-full bg-white border border-black rounded-md py-4 px-8 flex items-center justify-center text-base font-bold text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed"
                  >
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                      onClick={handleBuyNow}
                      type="button"
                      disabled={isOutOfStock}
                      className="w-full bg-black border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-base font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                      {isOutOfStock ? 'Out of Stock' : 'Buy It Now'}
                  </button>
              </div>
            </div>

          {/* Social Share Section */}
          <div className="mt-8 text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-800">Share</h3>
            <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2">
                {/* WhatsApp Button */}
                <a 
                    href={`https://api.whatsapp.com/send?text=Check%20out%20this%20XOID%20tee%3A%20${encodeURIComponent(product.name)}%20-%20${encodeURIComponent(window.location.href)}`} 
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
            <div className="mt-12">
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

      <SimilarProducts products={products} currentProductId={product.id} />
    </div>
  );
};

export default ProductPage;