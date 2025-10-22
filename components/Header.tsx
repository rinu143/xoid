import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart, useAuth, useWishlist, useProducts } from '../App';
import { Product } from '../types';

// --- Helper function at module scope ---
const getUserInitials = (name: string): string => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};


// --- Search Modal Component (Redesigned for Premium UX) ---
interface SearchModalProps {
  onClose: () => void;
}

const trendingSearches = ['Minimalist', 'Graphic', 'Heavyweight', 'Noir Canvas'];
const categories = [
    { name: 'Graphic Tees', keywords: ['graphic', 'print', 'statement', 'metallic', 'chrome'] },
    { name: 'Minimalist', keywords: ['minimalist', 'simple', 'basic', 'essential', 'void', 'noir', 'ivory'] },
    { name: 'Essentials', keywords: ['essential', 'basic', 'canvas', 'void', 'noir'] },
];

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const { products } = useProducts();
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

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

    const handleResultClick = (path: string) => {
        navigate(path);
        onClose();
    };

    const searchResults = useMemo(() => {
        if (query.trim().length < 2) return null;
        const lowerCaseQuery = query.toLowerCase();

        const matchedProducts = products.filter(product => 
            product.name.toLowerCase().includes(lowerCaseQuery) ||
            product.description.toLowerCase().includes(lowerCaseQuery) ||
            product.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery))
        );

        const matchedSuggestions = trendingSearches.filter(term => 
            term.toLowerCase().includes(lowerCaseQuery)
        );

        const matchedCategories = categories.filter(cat => 
            cat.name.toLowerCase().includes(lowerCaseQuery) ||
            cat.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery))
        );

        return {
            products: matchedProducts,
            suggestions: matchedSuggestions,
            categories: matchedCategories
        };
    }, [query, products]);
    
    const hasResults = searchResults && (searchResults.products.length > 0 || searchResults.suggestions.length > 0 || searchResults.categories.length > 0);

    const ResultSection: React.FC<{title: string, children: React.ReactNode, style?: React.CSSProperties}> = ({ title, children, style }) => (
        <div className="animate-fade-in-up" style={style}>
            <h3 className="text-base font-bold text-black mb-5">{title}</h3>
            {children}
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-lg z-[60] flex items-start justify-center p-4 sm:p-6 md:p-10 animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-modal-content-show" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={onClose} 
                  className="absolute top-5 right-6 z-10 p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                  aria-label="Close search"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="relative border-b border-gray-200 flex-shrink-0">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-8 pointer-events-none">
                        <svg className="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for tees, materials, etc."
                        className="w-full bg-transparent border-0 py-7 pl-20 pr-20 text-lg md:text-xl text-black placeholder-gray-400 focus:outline-none focus:ring-0"
                        autoComplete="off"
                    />
                    {query && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                            <button
                                onClick={() => setQuery('')}
                                className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                                aria-label="Clear search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {!searchResults ? (
                        /* Initial State */
                        <div className="space-y-10">
                            <ResultSection title="Trending Searches" style={{ animationDelay: '150ms' }}>
                                <div className="flex flex-wrap gap-3">
                                    {trendingSearches.map(term => (
                                        <button key={term} onClick={() => setQuery(term)} className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </ResultSection>
                            <ResultSection title="Featured Products" style={{ animationDelay: '250ms' }}>
                               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {featuredProducts.map(product => (
                                        <Link key={product.id} to={`/product/${product.id}`} onClick={onClose} className="group block search-product-card rounded-lg">
                                            <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-lg">
                                                <img src={product.imageUrls[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105" />
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-base text-black font-semibold truncate">{product.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">₹{product.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </ResultSection>
                        </div>
                    ) : hasResults ? (
                        /* Results State */
                        <div className="md:flex md:gap-10">
                            {(searchResults.suggestions.length > 0 || searchResults.categories.length > 0) && (
                                <div className="md:w-1/3 flex-shrink-0 space-y-8 mb-8 md:mb-0">
                                    {searchResults.suggestions.length > 0 && (
                                        <ResultSection title="Suggestions" style={{ animationDelay: '100ms' }}>
                                            <div className="flex flex-col items-start gap-3">
                                                {searchResults.suggestions.map(term => (
                                                    <button key={term} onClick={() => setQuery(term)} className="text-lg text-black hover:underline p-1 -m-1">
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        </ResultSection>
                                    )}
                                    {searchResults.categories.length > 0 && (
                                        <ResultSection title="Categories" style={{ animationDelay: '200ms' }}>
                                             <div className="flex flex-col items-start gap-3">
                                                {searchResults.categories.map(cat => (
                                                    <button key={cat.name} onClick={() => setQuery(cat.name)} className="text-lg text-black hover:underline p-1 -m-1">
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </ResultSection>
                                    )}
                                </div>
                            )}

                             {searchResults.products.length > 0 && (
                                <div className="flex-1 min-w-0">
                                    <ResultSection title="Top Products" style={{ animationDelay: '300ms' }}>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
                                            {searchResults.products.slice(0, 6).map(product => (
                                                <Link key={product.id} to={`/product/${product.id}`} onClick={onClose} className="group block search-product-card rounded-lg">
                                                    <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-lg">
                                                        <img src={product.imageUrls[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105" />
                                                    </div>
                                                    <div className="mt-4">
                                                        <h3 className="text-base text-black font-semibold truncate">{product.name}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">₹{product.price}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        {searchResults.products.length > 6 && (
                                            <div className="mt-8 text-center">
                                                <button onClick={() => handleResultClick('/shop')} className="text-base font-bold text-black hover:underline">
                                                    View All {searchResults.products.length} Products &rarr;
                                                </button>
                                            </div>
                                        )}
                                    </ResultSection>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* No Results State */
                         <div className="space-y-10 animate-fade-in-up">
                            <div className="text-center pt-8">
                                <p className="text-xl text-black font-semibold">No results for "{query}"</p>
                                <p className="mt-2 text-gray-500">Try a different search term or check out our suggestions below.</p>
                            </div>
                            <ResultSection title="Trending Searches">
                                 <div className="flex flex-wrap gap-3 justify-center">
                                    {trendingSearches.map(term => (
                                        <button key={term} onClick={() => setQuery(term)} className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </ResultSection>
                            <ResultSection title="Featured Products">
                               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {featuredProducts.map(product => (
                                        <Link key={product.id} to={`/product/${product.id}`} onClick={onClose} className="group block search-product-card rounded-lg">
                                            <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-lg">
                                                <img src={product.imageUrls[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105" />
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-base text-black font-semibold truncate">{product.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">₹{product.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </ResultSection>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NavItem: React.FC<{ to: string; children: React.ReactNode; onClick?: (e: React.MouseEvent) => void; isMobile?: boolean; forceActive?: boolean; }> = ({ to, children, onClick, isMobile = false, forceActive = false }) => {
  if (isMobile) {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `block w-full text-left rounded-lg px-4 py-3 text-2xl font-bold transition-all duration-200 ${
            isActive ? 'bg-gray-100 text-black' : 'text-gray-700 hover:bg-gray-100 hover:text-black'
          }`
        }
      >
        {children}
      </NavLink>
    );
  }

  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => 
        `relative group py-2 text-base font-medium transition-colors duration-300 ${isActive || forceActive ? 'text-black' : 'text-gray-700 hover:text-black'}`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
          {(isActive || forceActive) && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black"></span>}
        </>
      )}
    </NavLink>
  );
};

const MobileNav: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
}> = ({ isOpen, onClose, isAdmin, isLoggedIn }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/');
  };
  
  const itemTransition = `transition-all duration-500 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[60] transform transition-transform ease-in-out duration-400 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="flex justify-between items-center p-6 flex-shrink-0 border-b border-gray-200">
          <Link to="/" onClick={onClose} className="text-3xl font-black tracking-widest text-black uppercase">XOID</Link>
          <button onClick={onClose} aria-label="Close menu" className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <nav className="px-6 py-8 flex-grow overflow-y-auto">
          <div className="space-y-2">
             <div className={itemTransition} style={{ transitionDelay: '150ms' }}>
                 <NavItem to="/" onClick={onClose} isMobile>Home</NavItem>
             </div>
             <div className={itemTransition} style={{ transitionDelay: '200ms' }}>
                 <NavItem to="/shop" onClick={onClose} isMobile>Shop</NavItem>
             </div>
             <div className={itemTransition} style={{ transitionDelay: '250ms' }}>
                 <NavItem to="/virtual-try-on" onClick={onClose} isMobile>
                   <span className="flex items-center">
                       Virtual Try-On
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.24 9.76L24 12L14.24 14.24L12 24L9.76 14.24L0 12L9.76 9.76L12 0Z" /></svg>
                   </span>
                 </NavItem>
             </div>
          </div>

          <div className="my-8 border-t border-gray-200"></div>

          <div className="space-y-2">
            <div className={itemTransition} style={{ transitionDelay: '300ms' }}>
              <NavItem to={isLoggedIn ? "/account" : "/login"} onClick={onClose} isMobile>My Account</NavItem>
            </div>
            <div className={itemTransition} style={{ transitionDelay: '350ms' }}>
              <NavItem to="/wishlist" onClick={onClose} isMobile>Wishlist</NavItem>
            </div>
            {isAdmin && (
              <div className={itemTransition} style={{ transitionDelay: '400ms' }}>
                <NavItem to="/admin" onClick={onClose} isMobile>Admin Panel</NavItem>
              </div>
            )}
          </div>
        </nav>

        <div className="px-6 py-6 border-t border-gray-200 flex-shrink-0">
          {isLoggedIn && user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-black text-white flex items-center justify-center text-base font-bold">
                      {getUserInitials(user.name)}
                  </div>
                  <div>
                      <p className="font-semibold text-black">{user.name}</p>
                      <Link to="/account" onClick={onClose} className="text-sm text-gray-500 hover:underline">View Account</Link>
                  </div>
              </div>
              <button onClick={handleLogout} className="font-semibold text-sm text-gray-600 hover:text-black rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={onClose} className="w-full bg-black text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
               Sign In
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 003 3h1a3 3 0 003-3v-1m-4-8V7a3 3 0 013-3h1a3 3 0 013 3v1" /></svg>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};


const Header: React.FC = () => {
  const { itemCount } = useCart();
  const { isLoggedIn, user, isAdmin } = useAuth();
  const { wishlist } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location]);
  
  const isShopActive = location.pathname.startsWith('/shop') || location.pathname.startsWith('/product/');

  return (
    <>
      <header className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-md z-50 border-b border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Nav Toggle (Left on mobile) */}
             <div className="md:hidden">
              <button onClick={() => setIsMobileNavOpen(true)} aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
            {/* Brand Logo (Center on mobile, Left on desktop) */}
            <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:flex-shrink-0">
              <Link to="/" className="text-4xl font-black tracking-widest text-black uppercase">
                XOID
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <NavItem to="/">Home</NavItem>
                <NavItem to="/shop" forceActive={isShopActive}>Shop</NavItem>
                <NavLink 
                  to="/virtual-try-on" 
                  className={({ isActive }) => 
                    `shine-effect relative group py-2 text-base font-bold transition-colors duration-300 ${
                      isActive ? 'text-black' : 'text-gray-700 hover:text-black'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center">
                        Virtual Try-On
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 ai-star-sparkle" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0L14.24 9.76L24 12L14.24 14.24L12 24L9.76 14.24L0 12L9.76 9.76L12 0Z" />
                        </svg>
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
                      {isActive && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black"></span>}
                    </>
                  )}
                </NavLink>
                {isAdmin && <NavItem to="/admin">Admin</NavItem>}
              </div>
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
               <Link to="/wishlist" className="relative text-gray-700 hover:text-black transition-colors hidden sm:block" aria-label="Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-black text-white text-xs font-bold rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to={isLoggedIn ? "/account" : "/login"} className="text-gray-700 hover:text-black transition-colors hidden sm:block" aria-label="Account">
                {isLoggedIn && user ? (
                  <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold" title={`Logged in as ${user.name}`}>
                    {getUserInitials(user.name)}
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
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
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} isAdmin={isAdmin} isLoggedIn={isLoggedIn} />
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default Header;