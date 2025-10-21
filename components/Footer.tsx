import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
                <Link to="/" className="text-2xl font-black tracking-widest text-black uppercase">
                    XOID
                </Link>
                <p className="mt-2 text-sm text-gray-500 max-w-xs">
                    The intersection of comfort and high fashion.
                </p>
                <div className="flex space-x-4 mt-4">
                    <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="Twitter">
                        {/* Twitter Icon */}
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="Instagram">
                        {/* Instagram Icon */}
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 4.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 11.172 2h1.143zM12 7.167a4.833 4.833 0 100 9.666 4.833 4.833 0 000-9.666zM12 15a3 3 0 110-6 3 3 0 010 6zm4.805-7.778a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" clipRule="evenodd" /></svg>
                    </a>
                </div>
            </div>

            {/* Links Sections */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase">Shop</h3>
                <ul className="mt-4 space-y-3">
                    <li><Link to="/shop" className="text-sm text-gray-600 hover:text-black transition-colors">All Products</Link></li>
                    <li><Link to="/virtual-try-on" className="text-sm text-gray-600 hover:text-black transition-colors">Virtual Try-On</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase">Information</h3>
                <ul className="mt-4 space-y-3">
                    <li><Link to="/info#contact" className="text-sm text-gray-600 hover:text-black transition-colors">Contact Us</Link></li>
                    <li><Link to="/info#shipping" className="text-sm text-gray-600 hover:text-black transition-colors">Shipping Policy</Link></li>
                    <li><Link to="/info#refunds" className="text-sm text-gray-600 hover:text-black transition-colors">Cancellations & Refunds</Link></li>
                </ul>
            </div>
             <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-3">
                    <li><Link to="/info#terms" className="text-sm text-gray-600 hover:text-black transition-colors">Terms & Conditions</Link></li>
                    <li><Link to="/info#privacy" className="text-sm text-gray-600 hover:text-black transition-colors">Privacy Policy</Link></li>
                </ul>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
             <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} XOID. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;