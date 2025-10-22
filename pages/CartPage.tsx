
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../App';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, itemCount } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-black sm:text-4xl">Shopping Cart</h1>

      {itemCount === 0 ? (
        <div className="mt-12 text-center py-20 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-black">Your Cart is Empty</h2>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">Looks like you haven't added anything yet. Explore our collection to find your next favorite piece.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-black text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition-transform transform hover:scale-105"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {cart.map((product) => (
                <li key={product.cartItemId} className="relative flex py-6 sm:py-8">
                  <div className="flex-shrink-0">
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-24 h-32 sm:w-32 sm:h-40 rounded-md object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-base sm:text-lg">
                          <Link to={`/product/${product.id}`} className="font-bold text-black hover:text-gray-800">
                            {product.name}
                          </Link>
                        </h3>
                         <button type="button" onClick={() => removeFromCart(product.cartItemId)} className="p-1 -mt-1 -mr-1 text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Remove</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                      </div>
                      <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">{product.colors[0]}</p>
                        {product.size && (
                          <p className="ml-4 pl-4 border-l border-gray-200 text-gray-500">Size: {product.size}</p>
                        )}
                      </div>
                       <p className="mt-2 text-sm font-medium text-gray-600">₹{product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md w-fit">
                            <button
                                type="button"
                                onClick={() => updateQuantity(product.cartItemId, product.quantity - 1)}
                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                                disabled={product.quantity <= 1}
                            >
                                &ndash;
                            </button>
                            <span className="px-4 py-1.5 text-black font-medium text-sm" aria-live="polite">{product.quantity}</span>
                            <button
                                type="button"
                                onClick={() => updateQuantity(product.cartItemId, product.quantity + 1)}
                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r-md"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                       <p className="ml-4 text-base font-bold text-black">₹{(product.price * product.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 lg:sticky lg:top-24"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-black">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-black">₹{subtotal.toFixed(2)}</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-500">Calculated at next step</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-black">Order total</dt>
                <dd className="text-base font-medium text-black">₹{subtotal.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full bg-black border border-transparent rounded-md shadow-sm py-4 px-4 text-base font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black flex items-center justify-center transition-all duration-200 transform active:scale-95"
              >
                Proceed to Checkout
              </Link>
            </div>
             <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or{' '}
                  <Link to="/shop" className="text-black font-medium hover:underline">
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
          </section>
        </form>
      )}
    </div>
  );
};

export default CartPage;
