
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../App';
import { useToast } from '../components/ToastProvider';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, removeFromCart } = useCart();
  const { addToast } = useToast();
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Placeholder for shipping, can be replaced with actual logic
  const shippingCost = subtotal > 0 ? 5.00 : 0; 
  const total = subtotal + shippingCost;

  useEffect(() => {
    // If cart is empty on page load, redirect to the cart page
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Thank you for your order! (This is a demo)");
    clearCart();
    navigate('/');
  };
  
  // Render nothing while redirecting
  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-black sm:text-4xl mb-8 lg:mb-12">Checkout</h1>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <main className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <h2 className="text-lg font-medium text-black">Contact information</h2>
              <div className="mt-4">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black">Shipping information</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                  <input type="text" name="first-name" id="first-name" required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                  <input type="text" name="last-name" id="last-name" required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input type="text" name="address" id="address" required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black">Payment details</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-4">
                <div>
                  <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card number</label>
                  <input type="text" id="card-number" name="card-number" required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-3 gap-x-4">
                  <div>
                    <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
                    <input type="text" name="expiration-date" id="expiration-date" required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" placeholder="MM / YY" />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                    <input type="text" name="cvc" id="cvc" required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2" placeholder="CVC" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
              >
                Pay ${total.toFixed(2)}
              </button>
            </div>
          </form>
        </main>

        {/* Order summary */}
        <aside className="mt-16 lg:mt-0 lg:col-span-5">
           <div className="bg-gray-50 rounded-lg p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-medium text-black">Order summary</h2>

              <ul role="list" className="mt-6 divide-y divide-gray-200">
                {cart.map((product) => (
                  <li key={product.cartItemId} className="flex py-6">
                    <div className="flex-shrink-0 w-24 h-32 border border-gray-200 rounded-md overflow-hidden">
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-black">
                          <h3>{product.name}</h3>
                          <p className="ml-4">${(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Size: {product.size}</p>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {product.quantity}</p>
                        <div className="flex">
                           <button 
                              type="button" 
                              onClick={() => removeFromCart(product.cartItemId)}
                              className="font-medium text-red-600 hover:text-black hover:underline"
                            >
                             Remove
                           </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <dl className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-black">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Shipping</dt>
                  <dd className="text-sm font-medium text-black">${shippingCost.toFixed(2)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-black">Order total</dt>
                  <dd className="text-base font-medium text-black">${total.toFixed(2)}</dd>
                </div>
              </dl>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
