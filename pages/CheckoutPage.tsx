

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../App';
import { useToast } from '../components/ToastProvider';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
  'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
].sort();

// A reusable component for the new floating label input fields
const FloatingLabelInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => {
  return (
    <div className="relative">
      <input
        id={id}
        placeholder=" "
        className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-black bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
      >
        {label}
      </label>
    </div>
  );
};

// A reusable component for the new floating label select fields with custom styling
const FloatingLabelSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }> = ({ label, id, children, ...props }) => {
  return (
    <div className="relative group">
      <select
        id={id}
        // FIX: Removed invalid 'placeholder' attribute from select element.
        className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-black bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer pr-10"
        {...props}
      >
        {children}
      </select>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500 transition-colors group-focus-within:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
      </div>
       <label
        htmlFor={id}
        // FIX: Replaced 'peer-placeholder-shown' with 'peer-invalid' to correctly handle floating label for required select elements.
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-invalid:scale-100 peer-invalid:-translate-y-1/2 peer-invalid:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
      >
        {label}
      </label>
    </div>
  );
};


const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, removeFromCart } = useCart();
  const { addToast } = useToast();
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 5.00 : 0; 
  const total = subtotal + shippingCost;

  useEffect(() => {
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
                 <FloatingLabelInput
                    label="Email address"
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    required
                  />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black">Shipping information</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
                <div className="sm:col-span-6">
                  <FloatingLabelSelect label="Country" id="country" name="country" autoComplete="country-name" required>
                    <option>India</option>
                  </FloatingLabelSelect>
                </div>

                <div className="sm:col-span-3">
                  <FloatingLabelInput label="First name" type="text" name="first-name" id="first-name" autoComplete="given-name" required />
                </div>
                
                <div className="sm:col-span-3">
                   <FloatingLabelInput label="Last name" type="text" name="last-name" id="last-name" autoComplete="family-name" required />
                </div>
                
                <div className="sm:col-span-6">
                  <FloatingLabelInput label="Address" type="text" name="address" id="address" autoComplete="street-address" required />
                </div>
                
                <div className="sm:col-span-6">
                   <FloatingLabelInput label="Apartment, suite, etc. (optional)" type="text" name="apartment" id="apartment" autoComplete="address-line2" />
                </div>

                <div className="sm:col-span-2">
                   <FloatingLabelInput label="City" type="text" name="city" id="city" autoComplete="address-level2" required />
                </div>
                
                <div className="sm:col-span-2">
                    <FloatingLabelSelect label="State" id="state" name="state" autoComplete="address-level1" required>
                       <option value="" disabled selected hidden></option>
                       {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                    </FloatingLabelSelect>
                </div>
                
                <div className="sm:col-span-2">
                    <FloatingLabelInput label="PIN code" type="text" name="postal-code" id="postal-code" autoComplete="postal-code" required pattern="[0-9]{6}" />
                </div>

                 <div className="sm:col-span-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 z-10 flex items-center">
                      <select 
                        id="country-code" 
                        name="country-code" 
                        className="h-full border-0 bg-transparent py-0 pl-3.5 pr-2 text-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                        defaultValue="+91"
                      >
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+61</option>
                      </select>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder=" "
                      className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-black bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer pl-[4.75rem]"
                      autoComplete="tel"
                      required
                      pattern="\d{10,}"
                    />
                    <label
                      htmlFor="phone"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-[4.25rem]"
                    >
                      Phone number
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-black px-6 py-4 text-base font-bold text-white shadow-sm hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Place Order
              </button>
            </div>
          </form>
        </main>

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
                              className="font-medium text-black hover:underline"
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