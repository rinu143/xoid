import React, { useState, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CartItem, Product, Address, User } from './types';
import { productsData } from './data/products';
import { usersData } from './data/users';
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
import AdminPage from './pages/admin/AdminPage';
import VirtualTryOnPage from './pages/VirtualTryOnPage';
import CompanyInfoPage from './pages/CompanyInfoPage';

// Product Context
interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
}
const ProductContext = createContext<ProductContextType | null>(null);
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(productsData);
  
  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: Date.now(), // Simple unique ID generation
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};


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
interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  // FIX: Updated `updateUser` to accept a Partial<User> to allow updating any user property, including addresses.
  updateUser: (details: Partial<User>) => void;
  updateUserRole: (userId: string, role: 'admin' | 'customer') => void;
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
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(usersData);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
        setLoggedInUser(foundUser);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setLoggedInUser(null);
  };
  
  // FIX: Updated `updateUser` signature to match the context type.
  const updateUser = (details: Partial<User>) => {
    if (loggedInUser) {
        const updatedUser = { ...loggedInUser, ...details };
        setLoggedInUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === loggedInUser.id ? updatedUser : u));
    }
  };
  
  const updateUserRole = (userId: string, role: 'admin' | 'customer') => {
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role } : u));
  };


  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (loggedInUser && loggedInUser.password === currentPassword) {
        const updatedUser = { ...loggedInUser, password: newPassword };
        setLoggedInUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === loggedInUser.id ? updatedUser : u));
        return true;
    }
    return false;
  };
  
  const addAddress = (address: Omit<Address, 'id'>) => {
    if (!loggedInUser) return;
    const newAddress: Address = { ...address, id: Date.now().toString() };
    let newAddresses = [...loggedInUser.addresses, newAddress];
    if (newAddress.isDefault) {
      newAddresses = newAddresses.map(a => 
        a.id === newAddress.id ? a : { ...a, isDefault: false }
      );
    } else if (newAddresses.length === 1) {
      newAddresses[0].isDefault = true;
    }
    // FIX: Simplified call to updateUser, passing only the changed properties.
    updateUser({ addresses: newAddresses });
  };

  const updateAddress = (updatedAddress: Address) => {
    if (!loggedInUser) return;
    let newAddresses = loggedInUser.addresses.map(a => 
      a.id === updatedAddress.id ? updatedAddress : a
    );
    if (updatedAddress.isDefault) {
      newAddresses = newAddresses.map(a => 
        a.id === updatedAddress.id ? a : { ...a, isDefault: false }
      );
    }
    // FIX: Simplified call to updateUser, passing only the changed properties.
    updateUser({ addresses: newAddresses });
  };

  const deleteAddress = (addressId: string) => {
    if (!loggedInUser) return;
    let remainingAddresses = loggedInUser.addresses.filter(a => a.id !== addressId);
    const wasDefault = loggedInUser.addresses.find(a => a.id === addressId)?.isDefault;
    if (wasDefault && remainingAddresses.length > 0) {
      remainingAddresses[0] = { ...remainingAddresses[0], isDefault: true };
    }
    // FIX: Simplified call to updateUser, passing only the changed properties.
    updateUser({ addresses: remainingAddresses });
  };

  const setDefaultAddress = (addressId: string) => {
    if (!loggedInUser) return;
    const newAddresses = loggedInUser.addresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    // FIX: Simplified call to updateUser, passing only the changed properties.
    updateUser({ addresses: newAddresses });
  };
  
  const isLoggedIn = !!loggedInUser;
  const isAdmin = loggedInUser?.role === 'admin';

  const value = { isLoggedIn, isAdmin, user: loggedInUser, users, login, logout, updateUser, updateUserRole, changePassword, addAddress, updateAddress, deleteAddress, setDefaultAddress, pendingAction, setPendingAction };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<number[]>([]);
    const { addToast } = useToast();
    const { isLoggedIn, setPendingAction } = useAuth();
    const { products } = useProducts();
    const navigate = useNavigate();
    const location = useLocation();

    const _performAddToWishlist = useCallback((productId: number) => {
        setWishlist(prev => [...prev, productId]);
        const product = products.find(p => p.id === productId);
        addToast(`${product?.name || 'Item'} added to wishlist!`);
    }, [addToast, products]);
    
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
    }, [addToast, products]);

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
  const { products } = useProducts();
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
  }, [cart, addToast, products]);

  const addToCart = useCallback((product: Product, quantity: number, size: string) => {
    if (isLoggedIn) {
      _performAddToCart(product, quantity, size);
    } else {
      addToast('Please sign in to add items to your cart.', 'info');
      setPendingAction(() => () => {
        _performAddToCart(product, quantity, size);
      });
      navigate('/login-required', { state: { from: location }, replace: true });
    }
  }, [isLoggedIn, _performAddToCart, setPendingAction, navigate, location, addToast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const buyNow = useCallback((product: Product, quantity: number, size: string) => {
    const performBuyNowForLoggedInUser = () => {
        clearCart();
        _performAddToCart(product, quantity, size);
        navigate('/checkout');
    };

    const pendingBuyNowAction = () => {
        clearCart();
        _performAddToCart(product, quantity, size);
    };

    if (isLoggedIn) {
        performBuyNowForLoggedInUser();
    } else {
        addToast('Please sign in to buy now.', 'info');
        setPendingAction(() => pendingBuyNowAction);
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
  }, [cart, removeFromCart, addToast, products]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = { cart, addToCart, buyNow, removeFromCart, updateQuantity, clearCart, itemCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn, isAdmin } = useAuth();
    if (!isLoggedIn || !isAdmin) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const rootDivClass = isLoginPage
    ? "h-screen bg-white text-gray-800"
    : "flex flex-col min-h-screen bg-white text-gray-800";

  const mainClassName = isLoginPage
    ? "h-full"
    : "flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8";

  return (
    <div className={rootDivClass}>
      {!isLoginPage && <Header />}
      <main className={mainClassName}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
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
          <Route path="/virtual-try-on" element={<VirtualTryOnPage />} />
          <Route path="/virtual-try-on/:id" element={<VirtualTryOnPage />} />
          <Route path="/info" element={<CompanyInfoPage />} />
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
      {!isLoginPage && <BackToTopButton />}
      {!isLoginPage && <HelpWidget />}
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ToastProvider>
      <HashRouter>
        <AuthProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <AppLayout />
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </AuthProvider>
      </HashRouter>
    </ToastProvider>
  );
};

export default App;
