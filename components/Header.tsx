import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../App';
import { useAuth } from '../App';

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

  return (
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
               <NavLink
                to="/virtual-try-on"
                className="relative group py-2 text-base font-bold flex items-center gap-1.5"
              >
                {({ isActive }) => (
                  <>
                    <span className="shiny-text">Virtual Try-On</span>
                     <svg className="ai-star" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L10.25 10.25L2 12L10.25 13.75L12 22L13.75 13.75L22 12L13.75 10.25L12 2Z" fill="black"/>
                    </svg>
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
                    {isActive && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black"></span>}
                  </>
                )}
              </NavLink>
            </div>
          </div>
          <div className="flex items-center">
            <Link to={isLoggedIn ? "/account" : "/login"} className="text-gray-700 hover:text-black transition-colors mr-6" aria-label="Account">
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
  );
};

export default Header;