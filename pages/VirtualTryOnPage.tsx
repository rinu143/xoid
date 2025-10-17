import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { products } from '../data/products';
import VirtualTryOn from '../components/VirtualTryOn';

// A new component for the product selection card for a cleaner structure
const ProductSelectionCard: React.FC<{ product: Product; onSelect: () => void; }> = ({ product, onSelect }) => (
  <div
    onClick={onSelect}
    className="group cursor-pointer"
    role="button"
    aria-label={`Try on ${product.name}`}
  >
    <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-xl border border-gray-200/80 group-hover:shadow-xl transition-all duration-300">
      <img
        src={product.imageUrls[0]}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 flex items-end justify-center p-4">
         <div className="bg-white/90 backdrop-blur-sm text-black font-bold py-2 px-5 rounded-full text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            Try It On
         </div>
      </div>
    </div>
    <div className="mt-4 text-center">
      <h3 className="text-sm text-black font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">${product.price}</p>
    </div>
  </div>
);


const VirtualTryOnPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewVisible, setIsViewVisible] = useState(false); // Start false for initial animation

  useEffect(() => {
    setIsViewVisible(false); // Fade out the current view on change

    const animationTimer = setTimeout(() => {
      if (id) {
        const product = products.find(p => p.id === parseInt(id, 10));
        if (product) {
          setSelectedProduct(product);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // If ID is invalid, redirect to the selection page
          navigate('/virtual-try-on', { replace: true });
        }
      } else {
        setSelectedProduct(null);
      }
      setIsViewVisible(true); // Fade in the new view
    }, 300); // This delay should match the CSS transition duration

    return () => clearTimeout(animationTimer);
  }, [id, navigate]);

  const handleSelectProduct = (product: Product) => {
    // Navigate and let the useEffect handle the state update and animation
    navigate(`/virtual-try-on/${product.id}`);
  };

  const handleGoBack = () => {
    // Navigate back to the main selection page
    navigate('/virtual-try-on');
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Dynamic Header */}
      {!selectedProduct && (
        <div className={`text-center mb-12 transition-opacity duration-300 ${isViewVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-widest">
            Virtual Fitting Room
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
            Experience the future of shopping. Select any XOID tee from our collection below, then upload your photo to see how it fits instantly.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`transition-opacity duration-300 ${isViewVisible ? 'opacity-100' : 'opacity-0'}`}>
        {selectedProduct ? (
          // --- TRY-ON VIEW ---
          <div>
            <div className="mb-8 flex justify-between items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200/80">
              <div className="flex items-center gap-4">
                 <img src={selectedProduct.imageUrls[0]} alt={selectedProduct.name} className="w-16 h-20 rounded-md object-cover"/>
                 <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Now Trying</span>
                    <h2 className="text-xl font-bold text-black">{selectedProduct.name}</h2>
                 </div>
              </div>
              <button
                onClick={handleGoBack}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1.5 group"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                 </svg>
                Change Product
              </button>
            </div>
            <div className="p-4 sm:p-8 border border-gray-200/80 rounded-xl bg-white shadow-lg">
              <VirtualTryOn product={selectedProduct} />
            </div>
          </div>
        ) : (
          // --- SELECTION VIEW ---
          <div>
            <div className="text-center mb-10">
                <h2 className="text-xl font-bold text-black mb-1">Step 1: Select a Product</h2>
                <p className="text-gray-500">Choose an item from the collection to begin.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-12">
              {products.map(product => (
                <ProductSelectionCard 
                  key={product.id}
                  product={product}
                  onSelect={() => handleSelectProduct(product)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTryOnPage;