import React, { useState, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { CartItem, Product, Address } from './types';
import { products } from './data/products';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastProvider, useToast } from './components/ToastProvider';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import BackToTopButton from './components/BackToTopButton';
import WishlistPage from './pages/WishlistPage';
import HelpWidget from './components/HelpWidget';

// Cart Context
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size: string) => void;
  buyNow: (product: Product, quantity: number, size: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Wishlist Context
interface WishlistContextType {
  wishlist: number[]; // Array of product IDs
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isProductInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

// Auth Context
interface User {
    name: string;
    email: string;
    password?: string;
    addresses: Address[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (details: { name?: string; email?: string }) => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  pendingAction: (() => void) | null;
  setPendingAction: (action: (() => void) | null) => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const login = (email: string, password: string): boolean => {
    // Mock credentials
    if (email.toLowerCase() === 'admin@gmail.com' && password === 'admin123') {
      setIsLoggedIn(true);
      setUser({ name: 'John Doe', email: 'admin@gmail.com', password: 'admin123', addresses: [] });
      
      if (pendingAction) {
        pendingAction();
        setPendingAction(null); // Clear action after execution
      }

      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };
  
  const updateUser = (details: { name?: string; email?: string }) => {
    if (user) {
      setUser(prevUser => ({ ...prevUser!, ...details }));
    }
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (user && user.password === currentPassword) {
        setUser(prevUser => ({ ...prevUser!, password: newPassword }));
        return true;
    }
    return false;
  };
  
  const addAddress = (address: Omit<Address, 'id'>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newAddress: Address = { ...address, id: Date.now().toString() };
      let newAddresses = [...prevUser.addresses, newAddress];
      // If the new address is set as default, unset the old default
      if (newAddress.isDefault) {
        newAddresses = newAddresses.map(a => 
          a.id === newAddress.id ? a : { ...a, isDefault: false }
        );
      } else if (newAddresses.length === 1) {
        // If it's the first address, make it default
        newAddresses[0].isDefault = true;
      }
      return { ...prevUser, addresses: newAddresses };
    });
  };

  const updateAddress = (updatedAddress: Address) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      let newAddresses = prevUser.addresses.map(a => 
        a.id === updatedAddress.id ? updatedAddress : a
      );
      // If the updated address is set as default, unset the old default
      if (updatedAddress.isDefault) {
        newAddresses = newAddresses.map(a => 
          a.id === updatedAddress.id ? a : { ...a, isDefault: false }
        );
      }
      return { ...prevUser, addresses: newAddresses };
    });
  };

  const deleteAddress = (addressId: string) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      let remainingAddresses = prevUser.addresses.filter(a => a.id !== addressId);
      const wasDefault = prevUser.addresses.find(a => a.id === addressId)?.isDefault;
      // If the deleted address was the default and there are others left, make the first one the new default
      if (wasDefault && remainingAddresses.length > 0) {
        remainingAddresses[0] = { ...remainingAddresses[0], isDefault: true };
      }
      return { ...prevUser, addresses: remainingAddresses };
    });
  };

  const setDefaultAddress = (addressId: string) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newAddresses = prevUser.addresses.map(a => ({
        ...a,
        isDefault: a.id === addressId
      }));
      return { ...prevUser, addresses: newAddresses };
    });
  };

  const value = { isLoggedIn, user, login, logout, updateUser, changePassword, addAddress, updateAddress, deleteAddress, setDefaultAddress, pendingAction, setPendingAction };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<number[]>([]);
    const { addToast } = useToast();
    const { isLoggedIn, setPendingAction } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const _performAddToWishlist = useCallback((productId: number) => {
        setWishlist(prev => [...prev, productId]);
        const product = products.find(p => p.id === productId);
        addToast(`${product?.name || 'Item'} added to wishlist!`);
    }, [addToast]);
    
    const addToWishlist = useCallback((productId: number) => {
        if (isLoggedIn) {
            _performAddToWishlist(productId);
        } else {
            addToast('Please sign in to save items to your wishlist.', 'info');
            setPendingAction(() => () => _performAddToWishlist(productId));
            navigate('/login-required', { state: { from: location }, replace: true });
        }
    }, [isLoggedIn, _performAddToWishlist, setPendingAction, navigate, location, addToast]);
    
    const removeFromWishlist = useCallback((productId: number) => {
        setWishlist(prev => prev.filter(id => id !== productId));
        const product = products.find(p => p.id === productId);
        addToast(`${product?.name || 'Item'} removed from wishlist.`, 'info');
    }, [addToast]);

    const isProductInWishlist = useCallback((productId: number) => {
        return wishlist.includes(productId);
    }, [wishlist]);

    const value = { wishlist, addToWishlist, removeFromWishlist, isProductInWishlist };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};


const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { addToast } = useToast();
  const { isLoggedIn, setPendingAction } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const _performAddToCart = useCallback((product: Product, quantity: number, size: string) => {
    const productInStock = products.find(p => p.id === product.id);
    if (!productInStock) return;

    const cartItemId = `${product.id}-${size}`;
    const existingItem = cart.find(item => item.cartItemId === cartItemId);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    
    const availableStockForSize = productInStock.sizeStock[size] ?? 0;

    if (currentQuantityInCart + quantity > availableStockForSize) {
      addToast(`Cannot add more. Only ${availableStockForSize} in stock for size ${size}.`, 'error');
      return;
    }

    setCart(prevCart => {
      const existingItemInSetter = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItemInSetter) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity, size, cartItemId }];
    });
    
    addToast(`${product.name} added to cart.`);
  }, [cart, addToast]);

  const addToCart = useCallback((product: Product, quantity: number, size: string) => {
    if (isLoggedIn) {
      _performAddToCart(product, quantity, size);
    } else {
      addToast('Please sign in to add items to your cart.', 'info');
      setPendingAction(() => () => {
        _performAddToCart(product, quantity, size);
      });
       // Navigate to an intermediary protected route that will show the redirecting component
      navigate('/login-required', { state: { from: location }, replace: true });
    }
  }, [isLoggedIn, _performAddToCart, setPendingAction, navigate, location, addToast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const buyNow = useCallback((product: Product, quantity: number, size: string) => {
    // Action for already logged-in users
    const performBuyNowForLoggedInUser = () => {
        clearCart();
        _performAddToCart(product, quantity, size);
        navigate('/checkout');
    };

    // Action for guest users after they log in (without navigation)
    const pendingBuyNowAction = () => {
        clearCart();
        _performAddToCart(product, quantity, size);
    };

    if (isLoggedIn) {
        performBuyNowForLoggedInUser();
    } else {
        addToast('Please sign in to buy now.', 'info');
        setPendingAction(() => pendingBuyNowAction);
        // Navigate to the protected checkout route.
        // This will show the Redirecting component, then the login page.
        // After login, the user will be redirected to '/checkout' automatically.
        navigate('/checkout');
    }
}, [isLoggedIn, clearCart, _performAddToCart, navigate, setPendingAction, addToast]);


  const removeFromCart = useCallback((cartItemId: string) => {
    const itemToRemove = cart.find(item => item.cartItemId === cartItemId);
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
    if (itemToRemove) {
      addToast(`${itemToRemove.name} removed from cart.`, 'info');
    }
  }, [cart, addToast]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    const itemInCart = cart.find(i => i.cartItemId === cartItemId);
    if (!itemInCart) return;

    const productInStock = products.find(p => p.id === itemInCart.id);
    if (!productInStock) return;
    
    const availableStockForSize = productInStock.sizeStock[itemInCart.size] ?? 0;

    if (quantity > availableStockForSize) {
      addToast(`Only ${availableStockForSize} in stock for size ${itemInCart.size}.`, 'error');
      setCart(prevCart =>
        prevCart.map(item => (item.cartItemId === cartItemId ? { ...item, quantity: availableStockForSize } : item))
      );
      return;
    }
    
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
      );
      addToast('Cart updated.', 'info');
    }
  }, [cart, removeFromCart, addToast]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = { cart, addToCart, buyNow, removeFromCart, updateQuantity, clearCart, itemCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <HashRouter>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen bg-white text-gray-800">
                <Header />
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductPage products={products}/>} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route 
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                     <Route 
                      path="/login-required" 
                      element={
                        <ProtectedRoute>
                          {/* This content is never shown to unauthenticated users */}
                          <div /> 
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                      path="/account" 
                      element={
                        <ProtectedRoute>
                          <AccountPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route
                      path="/wishlist"
                      element={
                        <ProtectedRoute>
                          <WishlistPage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
                <BackToTopButton />
                <HelpWidget />
              </div>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </HashRouter>
    </ToastProvider>
  );
};

export default App;