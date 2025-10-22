import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../App';
import { useToast } from '../components/ToastProvider';
import { useAuth } from '../App';
import { Address } from '../types';

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
        className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-black bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer pr-10 transition-colors duration-200 hover:border-gray-400"
        {...props}
      >
        {children}
      </select>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500 transition-colors duration-200 group-hover:text-black group-focus-within:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
      </div>
       <label
        htmlFor={id}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-[&:not([value=''])]:scale-75 peer-[&:not([value=''])]:text-gray-500 peer-[&:not([value=''])]:bg-white peer-[&:not([value=''])]:px-2 peer-[&:not([value=''])]:top-2 peer-[&:not([value=''])]:z-10 peer-[&:not([value=''])]:origin-[0] peer-[&:not([value=''])]:-translate-y-4 start-1 peer-focus:scale-75 peer-focus:top-2 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
};

const AddressCard: React.FC<{ address: Address, isSelected: boolean, onSelect: () => void }> = ({ address, isSelected, onSelect }) => (
    <div 
        onClick={onSelect}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'border-black bg-gray-50 shadow-md' : 'border-gray-300 bg-white hover:border-gray-400'}`}
    >
        <div className="flex justify-between items-start">
            <p className="font-bold text-black">{address.firstName} {address.lastName}</p>
            {address.isDefault && <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Default</span>}
        </div>
        <div className="mt-2 text-sm text-gray-600">
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>{address.city}, {address.state} {address.postalCode}</p>
            <p>{address.country}</p>
            <p className="mt-1">{address.phone}</p>
        </div>
    </div>
);


const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, removeFromCart } = useCart();
  const { addToast } = useToast();
  const { user, addAddress } = useAuth();
  
  const hasAddresses = user && user.addresses.length > 0;

  const [isMobileSummaryExpanded, setIsMobileSummaryExpanded] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const [formState, setFormState] = useState({
      email: user?.email || '',
      country: 'India',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      phone: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 5.00 : 0; 
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);
  
  useEffect(() => {
    if (hasAddresses) {
        const defaultAddress = user.addresses.find(a => a.isDefault);
        setSelectedAddressId(defaultAddress ? defaultAddress.id : user.addresses[0].id);
    }
  }, [hasAddresses, user?.addresses]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasAddresses && !selectedAddressId) {
        addToast('Please select a shipping address.', 'error');
        return;
    }

    if (!hasAddresses) {
        // Here you would typically add form validation
        if (saveAddress) {
            addAddress({
                firstName: formState.firstName,
                lastName: formState.lastName,
                addressLine1: formState.address,
                addressLine2: formState.apartment,
                city: formState.city,
                state: formState.state,
                postalCode: formState.postalCode,
                country: formState.country,
                phone: formState.phone,
                isDefault: true // The first address saved is made the default
            });
        }
    }

    addToast("Thank you for your order! (This is a demo)");
    clearCart();
    navigate('/');
  };
  
  if (cart.length === 0) {
    return null;
  }

  const OrderSummaryContent = () => (
     <>
        <ul role="list" className="divide-y divide-gray-200">
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
        <dl className="space-y-4 border-t border-gray-200 pt-6">
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
     </>
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-black sm:text-4xl mb-8 lg:mb-12">Checkout</h1>
       {/* Mobile Order Summary */}
        <div className="lg:hidden bg-gray-50 border border-gray-200/80 rounded-lg mb-8">
            <button
                onClick={() => setIsMobileSummaryExpanded(!isMobileSummaryExpanded)}
                className="w-full flex justify-between items-center p-4"
                aria-expanded={isMobileSummaryExpanded}
            >
                <span className="flex items-center gap-2 text-black font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{isMobileSummaryExpanded ? 'Hide' : 'Show'} order summary</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isMobileSummaryExpanded ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </span>
                <span className="text-lg font-bold text-black">${total.toFixed(2)}</span>
            </button>
            <div className={`transition-all duration-500 ease-in-out grid ${isMobileSummaryExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="p-4 border-t border-gray-200/80">
                       <OrderSummaryContent />
                    </div>
                </div>
            </div>
        </div>

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
                    name="email"
                    autoComplete="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                  />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black">Shipping information</h2>
              
              <div className="mt-6">
                {hasAddresses ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.addresses.map(addr => (
                                <AddressCard 
                                    key={addr.id}
                                    address={addr}
                                    isSelected={selectedAddressId === addr.id}
                                    onSelect={() => setSelectedAddressId(addr.id)}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 pt-2">
                            Need to make a change?{' '}
                            <Link to="/account" className="font-medium text-black hover:underline">
                                Manage your addresses
                            </Link>
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
                        <div className="sm:col-span-6">
                          <FloatingLabelSelect label="Country" id="country" name="country" autoComplete="country-name" value={formState.country} onChange={handleInputChange} required>
                            <option>India</option>
                          </FloatingLabelSelect>
                        </div>

                        <div className="sm:col-span-3">
                          <FloatingLabelInput label="First name" type="text" name="firstName" id="first-name" autoComplete="given-name" value={formState.firstName} onChange={handleInputChange} required />
                        </div>
                        
                        <div className="sm:col-span-3">
                           <FloatingLabelInput label="Last name" type="text" name="lastName" id="last-name" autoComplete="family-name" value={formState.lastName} onChange={handleInputChange} required />
                        </div>
                        
                        <div className="sm:col-span-6">
                          <FloatingLabelInput label="Address" type="text" name="address" id="address" autoComplete="street-address" value={formState.address} onChange={handleInputChange} required />
                        </div>
                        
                        <div className="sm:col-span-6">
                           <FloatingLabelInput label="Apartment, suite, etc. (optional)" type="text" name="apartment" id="apartment" autoComplete="address-line2" value={formState.apartment} onChange={handleInputChange} />
                        </div>

                        <div className="sm:col-span-2">
                           <FloatingLabelInput label="City" type="text" name="city" id="city" autoComplete="address-level2" value={formState.city} onChange={handleInputChange} required />
                        </div>
                        
                        <div className="sm:col-span-2">
                            <FloatingLabelSelect label="State" id="state" name="state" autoComplete="address-level1" value={formState.state} onChange={handleInputChange} required>
                               <option value="" disabled></option>
                               {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                            </FloatingLabelSelect>
                        </div>
                        
                        <div className="sm:col-span-2">
                            <FloatingLabelInput label="PIN code" type="text" name="postalCode" id="postal-code" autoComplete="postal-code" required pattern="[0-9]{6}" value={formState.postalCode} onChange={handleInputChange} />
                        </div>

                         <div className="sm:col-span-6">
                            <FloatingLabelInput label="Phone number" type="tel" name="phone" id="phone" autoComplete="tel" required pattern="\d{10,}" value={formState.phone} onChange={handleInputChange} />
                        </div>

                        <div className="sm:col-span-6">
                            <div className="flex items-center">
                                <input
                                    id="save-address"
                                    name="save-address"
                                    type="checkbox"
                                    checked={saveAddress}
                                    onChange={(e) => setSaveAddress(e.target.checked)}
                                    className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                                />
                                <label htmlFor="save-address" className="ml-2 block text-sm text-gray-700">
                                    Save this information for next time
                                </label>
                            </div>
                        </div>
                    </div>
                )}
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

        <aside className="mt-16 lg:mt-0 lg:col-span-5 hidden lg:block">
           <div className="bg-gray-50 rounded-lg p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-medium text-black">Order summary</h2>
              <div className="mt-6">
                <OrderSummaryContent />
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;