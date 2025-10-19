import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { useProducts } from '../App';

interface SimilarProductsProps {
  currentProductId: number;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ currentProductId }) => {
  const { products } = useProducts();
  // A simple logic: show other products, excluding the current one.
  const similar = products.filter(p => p.id !== currentProductId).slice(0, 4);

  if (similar.length === 0) {
    return null;
  }

  return (
    <div className="mt-24 py-16 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-center text-black mb-12">You Might Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {similar.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;