import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist, useProducts } from '../App';
import ProductCard from '../components/ProductCard';

interface WishlistPageProps {
  showTitle?: boolean;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ showTitle = true }) => {
  const { wishlist } = useWishlist();
  const { products } = useProducts();
  const wishlistedProducts = products.filter(product => wishlist.includes(product.id));

  return (
    <div className="max-w-7xl mx-auto">
      {showTitle && <h1 className="text-3xl font-extrabold text-black sm:text-4xl mb-8">My Wishlist</h1>}
      
      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-black">Your Wishlist is Empty</h2>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">Save your favorite items by clicking the heart icon on any product.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-black text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition-transform transform hover:scale-105"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;