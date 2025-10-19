import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const HomePage: React.FC = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-80px)] min-h-[500px] md:min-h-[700px] bg-cover bg-center bg-no-repeat flex items-end text-white rounded-lg overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://saberandsacrifice.com/cdn/shop/files/DSC01373_4124x2749_crop_center.jpg?v=1757669574')" }}
        ></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>

        {/* Content */}
        <div className="relative z-20 p-8 md:p-16 w-full max-w-4xl text-left">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-widest leading-tight">
            Don't impress, Express
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/80 max-w-xl">
            Experience the intersection of comfort and high fashion. XOID presents a curated collection of oversized tees for the modern silhouette.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block bg-white text-black border-2 border-white font-bold py-3 px-10 rounded-md hover:bg-transparent hover:text-white transition-all duration-300 transform active:scale-95"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <div>
        <h2 className="text-3xl font-bold text-center text-black mb-8">Featured Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-block bg-white text-black border border-black font-bold py-3 px-10 rounded-md hover:bg-black hover:text-white transition-all duration-300 transform active:scale-95"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;