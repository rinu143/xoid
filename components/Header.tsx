import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../App';
import { useAuth } from '../App';
import { useWishlist } from '../App';
import { products } from '../data/products';
import { Product } from '../types';

// --- Search Modal Component ---
// Defined within Header.tsx to avoid creating a new file per environment constraints.
interface SearchModalProps {
  onClose: () => void;
}

const colorMap: { [key: string]: string } = {
  Black: '#111827',
  White: '#ffffff',
  Cream: '#F3EFE9',
  'Light Blue': '#A7D5E1'
};

const popularSearches = ['Minimalist', 'Graphic', 'Heavyweight Cotton', 'Noir'];

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const availableColors = useMemo(() => Array.from(new Set(products.map(p => p.color))), []);
  const availableSizes = useMemo(() => {
    const allSizes = products.flatMap(p => p.sizes);
    return ['S', 'M', 'L', 'XL'].filter(size => allSizes.includes(size));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = products.filter(product => {
      const queryMatch = query.trim().length > 1
        ? product.name.toLowerCase().includes(lowerCaseQuery) || product.description.toLowerCase().includes(lowerCaseQuery)
        : true;
      const colorMatch = selectedColors.length > 0 ? selectedColors.includes(product.color) : true;
      const sizeMatch = selectedSizes.length > 0 ? selectedSizes.some(size => product.sizes.includes(size)) : true;
      return queryMatch && colorMatch && sizeMatch;
    });
    setResults(filtered);
  }, [query, selectedColors, selectedSizes]);

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };
  
  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedColors([]);
    setSelectedSizes([]);
  };
  
  const activeFiltersCount = query.trim().length > 1 ? 1 + selectedColors.length + selectedSizes.length : selectedColors.length + selectedSizes.length;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-start justify-center p-4 pt-[8vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input and Header */}
        <div className="relative border-b border-gray-200 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, keyword..."
            className="w-full bg-transparent border-0 py-6 pl-14 pr-6 text-lg text-black placeholder-gray-400 focus:outline-none focus:ring-0" autoComplete="off"
          />
        </div>
        
        <div className="flex-grow flex overflow-hidden">
            {/* Left Panel: Filters */}
            <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto hidden md:block">
                <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-4">Popular</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {popularSearches.map(term => (
                    <button key={term} onClick={() => setQuery(term)} className="px-3 py-1.5 bg-gray-100 text-sm text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                      {term}
                    </button>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-4">Filter by Color</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                    {availableColors.map(color => (
                        <button key={color} onClick={() => handleColorToggle(color)} className={`w-8 h-8 rounded-full border border-gray-300 transition-transform transform hover:scale-110 ${selectedColors.includes(color) ? 'ring-2 ring-offset-1 ring-black' : ''}`}
                         style={{ backgroundColor: colorMap[color] || '#ccc' }} aria-label={`Filter by color ${color}`} aria-pressed={selectedColors.includes(color)} />
                    ))}
                </div>

                <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-4">Filter by Size</h3>
                <div className="flex flex-wrap gap-3">
                    {availableSizes.map(size => (
                        <button key={size} onClick={() => handleSizeToggle(size)}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                        aria-pressed={selectedSizes.includes(size)}>{size}</button>
                    ))}
                </div>
            </div>

            {/* Right Panel: Results */}
            <div className="flex-grow p-6 overflow-y-auto">
              {(activeFiltersCount > 0) && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-black">{results.length} Result{results.length !== 1 && 's'}</p>
                  <button onClick={clearFilters} className="text-sm font-medium text-gray-600 hover:text-black hover:underline transition-colors">
                    Clear All
                  </button>
                </div>
              )}

              {results.length === 0 && (
                <div className="text-center py-16 px-6 h-full flex flex-col justify-center">
                  <p className="text-lg text-black font-semibold">No results found</p>
                  <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map(product => (
                    <Link key={product.id} to={`/product/${product.id}`} onClick={onClose} className="group block">
                       <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-md">
                          <img src={product.imageUrls[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105" />
                       </div>
                       <div className="mt-3">
                          <h3 className="text-sm text-black font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">${product.price}</p>
                       </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};


const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `relative group py-2 text-base font-medium transition-colors duration-300 ${
          isActive ? 'text-black' : 'text-gray-700 hover:text-black'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
          {isActive && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black"></span>}
        </>
      )}
    </NavLink>
  );
};


const Header: React.FC = () => {
  const { itemCount } = useCart();
  const { isLoggedIn } = useAuth();
  const { wishlist } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-md z-50 border-b border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex-shrink-0">
              <Link to="/" className="text-4xl font-black tracking-widest text-black uppercase">
                XOID
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <NavItem to="/">Home</NavItem>
                <NavItem to="/shop">Shop</NavItem>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
               <Link to="/wishlist" className="relative text-gray-700 hover:text-black transition-colors" aria-label="Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-black text-white text-xs font-bold rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to={isLoggedIn ? "/account" : "/login"} className="text-gray-700 hover:text-black transition-colors" aria-label="Account">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Link>
              <Link to="/cart" className="relative text-gray-700 hover:text-black transition-colors" aria-label="Shopping Cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-black text-white text-xs font-bold rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </header>
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default Header;