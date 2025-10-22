
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const Redirecting: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdown(prev => (prev > 1 ? prev - 1 : 0));
        }, 1000);
        
        const redirectTimeout = setTimeout(() => {
            // Prioritize `location.state.from` to handle intermediary routes.
            // This prevents a redirect loop and ensures the user lands at their
            // original destination after logging in.
            const fromLocation = location.state?.from || location;
            navigate('/login', { state: { from: fromLocation }, replace: true });
        }, 3000);

        return () => {
            clearInterval(countdownInterval);
            clearTimeout(redirectTimeout);
        };
    }, [navigate, location]);
    
    // Get a more descriptive page name based on the original path.
    const getPageName = () => {
        const path = (location.state?.from?.pathname || location.pathname).toLowerCase();
        if (path.includes('checkout')) return 'checkout';
        if (path.includes('account')) return 'your account';
        return 'this page';
    };

    const pageName = getPageName();


    return (
        <div className="flex items-center justify-center min-h-[60vh] bg-white px-4 py-12">
            <div className="max-w-md w-full text-center bg-gray-50 p-8 sm:p-12 rounded-2xl border border-gray-200/80 shadow-sm transition-all animate-fade-in">
                
                {/* Icon */}
                <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-gray-200 text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3">
                    Authentication Required
                </h1>
                
                {/* Description */}
                <p className="text-gray-600 mb-8">
                    To access {pageName}, you need to sign in to your ZOID account.
                </p>

                {/* Call to Action Button */}
                <button
                    onClick={() => navigate('/login', { state: { from: location.state?.from || location }, replace: true })}
                    className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-sm mb-4"
                >
                    Sign In
                </button>

                {/* Countdown Timer */}
                <p className="text-sm text-gray-500">
                  {countdown > 0 ? `Redirecting you in ${countdown}...` : 'Redirecting...'}
                </p>
            </div>
        </div>
    );
};


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirecting />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
