import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 lg:py-32">
      <p className="text-6xl sm:text-8xl lg:text-9xl font-black text-gray-200 tracking-widest relative select-none">
        404
        <span className="absolute inset-0 text-black text-opacity-5" style={{ textShadow: '2px 2px 0px white, -2px -2px 0px rgba(0,0,0,0.1)' }}>
          404
        </span>
      </p>
      <div className="mt-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-black uppercase tracking-wider">Page Not Found</h1>
        <p className="mt-2 text-base text-gray-600 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
      </div>
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-white bg-black hover:bg-gray-800 transition-all transform active:scale-95"
        >
          Go to Homepage
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-bold rounded-md text-black bg-white hover:bg-gray-100 transition-all transform active:scale-95"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
