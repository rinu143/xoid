import React, { useState, useMemo } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import { Product } from '../types';
import QuickViewModal from '../components/QuickViewModal';
import CustomSelect from '../components/CustomSelect';

export interface FiltersState {
  price: string;
  colors: string[];
  sizes: string[];
}

const priceRanges = [
  { label: 'All', value: '' },
  { label: '$100 - $120', value: '100-120' },
  { label: '$120 - $140', value: '120-140' },
  { label: '$140+', value: '140-9999' },
];

const ShopPage: React.FC = () => {
  const [filters, setFilters] = useState<FiltersState>({
    price: '',
    colors: [],
    sizes: [],
  });
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const availableColors = useMemo(() => Array.from(new Set(products.map(p => p.color))), []);
  const availableSizes = useMemo(() => {
    const allSizes = products.flatMap(p => p.sizes);
    const uniqueSizes = Array.from(new Set(allSizes));
    const sortOrder = ['S', 'M', 'L', 'XL'];
    uniqueSizes.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
    return uniqueSizes;
  }, []);

  const sortedAndFilteredProducts = useMemo(() => {
    let productsToDisplay = products.filter(product => {
      // Price filter
      if (filters.price) {
        const [min, max] = filters.price.split('-').map(Number);
        if (product.price < min || (max && product.price > max)) {
          return false;
        }
      }
      // Color filter
      if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
        return false;
      }
      // Size filter
      if (filters.sizes.length > 0) {
        if (!filters.sizes.some(size => product.sizes.includes(size))) {
          return false;
        }
      }
      return true;
    });

    switch (sortBy) {
      case 'price-asc':
        productsToDisplay.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        productsToDisplay.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        // The default order is already "featured"
        break;
    }

    return productsToDisplay;

  }, [filters, sortBy]);

  const handleFilterChange = (newFilters: Partial<FiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleClearFilters = () => {
    setFilters({ price: '', colors: [], sizes: [] });
  };

  const removeFilter = (type: keyof FiltersState, value: string) => {
    if (type === 'price') {
      handleFilterChange({ price: '' });
    } else {
      const currentValues = filters[type] as string[];
      const newValues = currentValues.filter(v => v !== value);
      handleFilterChange({ [type]: newValues });
    }
  };

  const activeFiltersForDisplay = [
    ...filters.colors.map(c => ({ type: 'colors' as keyof FiltersState, value: c, label: c })),
    ...filters.sizes.map(s => ({ type: 'sizes' as keyof FiltersState, value: s, label: `Size: ${s}`})),
    ...(filters.price ? [{ type: 'price' as keyof FiltersState, value: filters.price, label: priceRanges.find(p => p.value === filters.price)?.label || '' }] : [])
  ].filter(f => f.label);

  const activeFilterCount = activeFiltersForDisplay.length;

  return (
    <div>
      <section className="relative bg-black bg-cover bg-center py-20 md:py-32 mb-12 rounded-lg overflow-hidden">
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('https://saberandsacrifice.com/cdn/shop/files/DSC01373_4124x2749_crop_center.jpg?v=1757669574')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <div className="relative z-20 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest">
                Our Collection
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                Discover curated oversized essentials, crafted with premium materials for a modern, relaxed silhouette.
            </p>
        </div>
    </section>

      {/* Filter Drawer for Mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity lg:hidden ${
            isFilterPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterPanelOpen(false)}
        aria-hidden={!isFilterPanelOpen}
      >
        <div 
            className={`fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl transform transition-transform ease-in-out duration-300 ${
                isFilterPanelOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
        >
            <Filters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
                availableColors={availableColors}
                availableSizes={availableSizes}
                isMobile={true} 
                onClose={() => setIsFilterPanelOpen(false)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8">
        <aside className="hidden lg:block lg:col-span-1">
           <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
            availableColors={availableColors}
            availableSizes={availableSizes}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <button 
                onClick={() => setIsFilterPanelOpen(true)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-black lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              <span className="ml-2">Filters</span>
              {activeFilterCount > 0 && <span className="ml-2 text-xs bg-black text-white rounded-full h-5 w-5 flex items-center justify-center">{activeFilterCount}</span>}
            </button>
            <p className="hidden lg:block text-sm text-gray-600">{sortedAndFilteredProducts.length} Products</p>
            <div>
              <CustomSelect
                label="Sort by"
                id="sort-by"
                name="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </CustomSelect>
            </div>
          </div>
          
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center mb-6">
              {activeFiltersForDisplay.map(filter => (
                <div key={filter.label} className="flex items-center bg-gray-100 rounded-full pl-3 pr-1.5 py-1 text-sm font-medium text-gray-800">
                  <span>{filter.label}</span>
                  <button onClick={() => removeFilter(filter.type, filter.value)} className="ml-1.5 text-gray-500 hover:text-black rounded-full hover:bg-gray-200" aria-label={`Remove ${filter.label} filter`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button onClick={handleClearFilters} className="text-sm text-gray-600 hover:text-black hover:underline transition-colors">
                  Clear All
              </button>
            </div>
          )}

          {sortedAndFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
              {sortedAndFilteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onQuickViewClick={setQuickViewProduct} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 bg-gray-50 rounded-lg lg:col-span-3">
                <p className="text-gray-600 text-lg">No products match your criteria.</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting or clearing your filters.</p>
            </div>
          )}
        </main>
      </div>
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default ShopPage;