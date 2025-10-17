import React, { useState, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { CartItem, Product } from './types';
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
import VirtualTryOnPage from './pages/VirtualTryOnPage';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import BackToTopButton from './components/BackToTopButton';

// Cart Context
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size: string) => void;
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

// Auth Context
interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = (email: string, password: string): boolean => {
    // Mock credentials
    if (email.toLowerCase() === 'admin@gmail.com' && password === 'admin123') {
      setIsLoggedIn(true);
      setUser({ name: 'John Doe', email: 'admin@gmail.com' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };
  
  const value = { isLoggedIn, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { addToast } = useToast();

  const addToCart = useCallback((product: Product, quantity: number, size: string) => {
    const productInStock = products.find(p => p.id === product.id);
    if (!productInStock) return;

    const cartItemId = `${product.id}-${size}`;
    const existingItem = cart.find(item => item.cartItemId === cartItemId);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

    if (currentQuantityInCart + quantity > productInStock.stock) {
      addToast(`Cannot add more. Only ${productInStock.stock} in stock for ${product.name}.`, 'error');
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

    if (quantity > productInStock.stock) {
      addToast(`Only ${productInStock.stock} in stock for ${itemInCart.name}.`, 'error');
      setCart(prevCart =>
        prevCart.map(item => (item.cartItemId === cartItemId ? { ...item, quantity: productInStock.stock } : item))
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

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = { cart, addToCart, removeFromCart, updateQuantity, clearCart, itemCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <HashRouter>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-white text-gray-800">
              <Header />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductPage products={products}/>} />
                  <Route path="/virtual-try-on" element={<VirtualTryOnPage />} />
                  <Route path="/virtual-try-on/:id" element={<VirtualTryOnPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route 
                    path="/account" 
                    element={
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
              <BackToTopButton />
            </div>
          </CartProvider>
        </AuthProvider>
      </HashRouter>
    </ToastProvider>
  );
};

export default App;
