import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// --- Toast Icons ---
const SuccessIcon = () => (
    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ErrorIcon = () => (
    <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const InfoIcon = () => (
    <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


// --- Single Toast Component ---
interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const toastStyles = {
  success: {
    icon: <SuccessIcon />,
    title: 'Success',
    barClass: 'bg-green-400',
  },
  error: {
    icon: <ErrorIcon />,
    title: 'Error',
    barClass: 'bg-red-400',
  },
  info: {
    icon: <InfoIcon />,
    title: 'Information',
    barClass: 'bg-blue-400',
  },
};


const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Delay visibility for enter animation
        const enterTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        // Auto-dismiss after a delay
        const exitTimer = setTimeout(() => {
            setIsVisible(false);
            // Wait for exit animation to finish before removing from DOM
            const closeTimer = setTimeout(() => onClose(toast.id), 300); 
            return () => clearTimeout(closeTimer);
        }, 3000); 

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(exitTimer);
        };
    }, [onClose, toast.id]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 300);
    };

    const styles = toastStyles[toast.type];

    const animationClasses = isVisible
        ? 'opacity-100 translate-x-0 translate-y-0'
        : 'opacity-0 -translate-y-full sm:translate-y-0 sm:translate-x-full';

    return (
        <div
            className={`
                w-full max-w-sm sm:w-96 bg-white shadow-2xl rounded-lg pointer-events-auto flex
                transform transition-all duration-300 ease-in-out
                ${animationClasses}
            `}
        >
            {/* Color bar */}
            <div className={`w-1.5 rounded-l-lg ${styles.barClass}`}></div>

            <div className="flex-1 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        {styles.icon}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900">{styles.title}</p>
                        <p className="mt-1 text-sm text-gray-700">{toast.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            onClick={handleClose}
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Toast Provider and Container ---
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts(prevToasts => [ ...prevToasts, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Toast Container */}
            <div
                aria-live="assertive"
                className="fixed inset-0 pointer-events-none flex items-start sm:items-end justify-center sm:justify-end p-4 sm:p-6 z-[100]"
            >
                <div className="flex flex-col items-center sm:items-end space-y-4 w-full sm:w-auto">
                    {toasts.map((toast) => (
                       <Toast key={toast.id} toast={toast} onClose={removeToast} />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};