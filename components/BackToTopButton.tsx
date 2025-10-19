import React, { useState, useEffect } from 'react';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);

    const footer = document.getElementById('app-footer');
    if (!footer) {
      return () => window.removeEventListener('scroll', toggleVisibility);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(footer);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  const getTransformClasses = () => {
    if (!isVisible) {
      return 'translate-y-4';
    }
    if (isFooterVisible) {
      return '-translate-y-[90px]';
    }
    return 'translate-y-0';
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      className={`
        fixed bottom-24 right-6 z-50
        h-14 w-14 flex items-center justify-center
        bg-black text-white rounded-full
        shadow-lg 
        transition-all duration-300 ease-in-out
        transform hover:scale-110 hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        ${getTransformClasses()}
      `}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default BackToTopButton;
