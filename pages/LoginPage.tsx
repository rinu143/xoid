
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { useAuth } from '../App';

const loginImages = [
    'https://saberandsacrifice.com/cdn/shop/files/DSC01373_4124x2749_crop_center.jpg?v=1757669574',
    'https://saberandsacrifice.com/cdn/shop/files/230316E4-3528-4A0B-87D3-0A3FF8DAF663_1310x_crop_center.jpg?v=1754823242',
    'https://saberandsacrifice.com/cdn/shop/files/DSC07796_b3ef0d9d-f6fe-4e83-8556-d7d7608e37b0_1310x_crop_center.jpg?v=1723279071',
    'https://hinlers.com/cdn/shop/files/CCAB8C39-8F2C-4523-893D-DD2095606D2E.jpg?v=1757515785',
];


const SocialButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button
    type="button"
    className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.5 24.3H42.7V24.3H24.5V29.5H35.6C35.2 31.8 34 33.8 32.1 35.2L32 35.3L37 39.3L37.2 39.2C41.7 35.1 44.5 29.8 44.5 24.3Z" fill="#4285F4"/>
        <path d="M24.5 45C30.4 45 35.4 43 37.2 39.2L32.1 35.2C30.2 36.6 27.6 37.5 24.5 37.5C18.9 37.5 14.2 34 12.4 29.2L12.3 29.2L7.1 33.3L7 33.5C9.8 39.1 16.6 45 24.5 45Z" fill="#34A853"/>
        <path d="M12.4 29.2C12 28 11.8 26.8 11.8 25.5C11.8 24.2 12 23 12.4 21.8L12.4 21.7L7.2 17.6L7 17.5C5.8 20 5 22.7 5 25.5C5 28.3 5.8 31 7 33.5L12.4 29.2Z" fill="#FBBC05"/>
        <path d="M24.5 13.5C27.9 13.5 30.8 14.7 33.1 16.8L37.3 12.5C35.3 10.6 31.5 8 24.5 8C16.6 8 9.8 11.9 7 17.5L12.4 21.8C14.2 17 18.9 13.5 24.5 13.5Z" fill="#EA4335"/>
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="instagramGradient" gradientUnits="objectBoundingBox" cx="0.3" cy="0.7" r="1.2">
                <stop offset="0" stopColor="#FDCB52"/>
                <stop offset="0.5" stopColor="#FD1D1D"/>
                <stop offset="1" stopColor="#833AB4"/>
            </radialGradient>
        </defs>
        <path fill="url(#instagramGradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.584-.012-4.85-.069c-3.252-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.44c-3.117 0-3.483.011-4.71.069-2.76.126-3.955 1.321-4.081 4.081-.058 1.227-.069 1.592-.069 4.71s.011 3.483.069 4.71c.126 2.76 1.321 3.955 4.081 4.081 1.227.058 1.592.069 4.71.069 3.117 0 3.483-.011 4.71-.069 2.76-.126 3.955-1.321 4.081-4.081.058 1.227.069 1.592.069 4.71s-.011-3.483-.069-4.71c-.126-2.76-1.321-3.955-4.081-4.081-1.227-.058-1.592-.069-4.71-.069zm0 3.328c-1.956 0-3.538 1.582-3.538 3.538s1.582 3.538 3.538 3.538 3.538-1.582 3.538-3.538-1.582-3.538-3.538-3.538zm0 5.64c-1.161 0-2.102-.94-2.102-2.102s.94-2.102 2.102-2.102 2.102.94 2.102 2.102-.94 2.102-2.102 2.102zm4.56-5.262c-.733 0-1.328.596-1.328 1.328s.596 1.328 1.328 1.328 1.328-.596 1.328-1.328-.596-1.328-1.328-1.328z"/>
    </svg>
);

const CheckIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CircleIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const WarningIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

interface PasswordValidationState {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  specialChar: boolean;
  isPwned: boolean | null; // null when not checked
  pwnedCount: number;
}

const PasswordStrengthIndicator: React.FC<{ validation: PasswordValidationState, isChecking: boolean }> = ({ validation, isChecking }) => {
    const criteria = [
        { label: 'At least 8 characters', met: validation.length },
        { label: 'An uppercase letter (A-Z)', met: validation.uppercase },
        { label: 'A lowercase letter (a-z)', met: validation.lowercase },
        { label: 'A special character (!@#...)', met: validation.specialChar },
    ];

    const allCriteriaMet = criteria.every(c => c.met);

    return (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {criteria.map(c => (
                 <div key={c.label} className="flex items-center">
                    {c.met ? (
                        <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                        <CircleIcon className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    )}
                    <span className={c.met ? 'text-gray-800' : 'text-gray-500'}>{c.label}</span>
                </div>
            ))}
            <div className={`flex items-center sm:col-span-2 pt-2 mt-2 border-t ${allCriteriaMet ? 'border-gray-200' : 'border-transparent'}`}>
                {isChecking ? (
                    <div className="w-4 h-4 mr-2 flex items-center justify-center flex-shrink-0">
                        <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-500"></div>
                    </div>
                ) : validation.isPwned === true ? (
                    <WarningIcon className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                ) : validation.isPwned === false ? (
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                ) : (
                    <CircleIcon className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                )}
                 <span className={validation.isPwned ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                    {isChecking ? 'Checking for data breaches...' : 
                     validation.isPwned === true ? `Warning: Found in ${validation.pwnedCount.toLocaleString()} data breaches` : 
                     validation.isPwned === false ? 'Not found in known data breaches' : 
                     'Data breach check'}
                </span>
            </div>
        </div>
    );
};

// --- Helper Functions ---
async function sha1(str: string): Promise<string> {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}


const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Errors and state management
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // New state for signup flow
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // New state for password validation
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationState>({
    length: false, uppercase: false, lowercase: false, specialChar: false,
    isPwned: null, pwnedCount: 0,
  });
  const [isCheckingPwned, setIsCheckingPwned] = useState(false);
  const pwnedCheckTimeout = useRef<number | null>(null);
  
  const { addToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const nameFieldRef = useRef<HTMLDivElement>(null);
  const [nameFieldHeight, setNameFieldHeight] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const from = location.state?.from?.pathname || '/account';

  useEffect(() => {
    if (nameFieldRef.current) {
      setNameFieldHeight(nameFieldRef.current.scrollHeight);
    }
  }, [isLogin]);

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % loginImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
        addToast('Please enter your email address.', 'error');
        return;
    }
    addToast(`If an account for ${resetEmail} exists, a reset link has been sent. (This is a demo)`, 'info');
    setIsForgotPasswordModalOpen(false);
    setResetEmail('');
  };

  const validatePassword = (pass: string) => {
    const newValidationState = {
        length: pass.length >= 8,
        uppercase: /[A-Z]/.test(pass),
        lowercase: /[a-z]/.test(pass),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
        isPwned: passwordValidation.isPwned,
        pwnedCount: passwordValidation.pwnedCount,
    };
    setPasswordValidation(newValidationState);
  };

  const checkPwnedPassword = useCallback(async (pass: string) => {
    if (!pass) {
        setPasswordValidation(prev => ({ ...prev, isPwned: null, pwnedCount: 0 }));
        return;
    }
    setIsCheckingPwned(true);
    try {
        const hash = await sha1(pass);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if (!response.ok) throw new Error('API request failed');
        const text = await response.text();
        const lines = text.split('\n');
        const pwnedEntry = lines.find(line => line.split(':')[0] === suffix);

        if (pwnedEntry) {
            const count = parseInt(pwnedEntry.split(':')[1], 10);
            setPasswordValidation(prev => ({ ...prev, isPwned: true, pwnedCount: count }));
        } else {
            setPasswordValidation(prev => ({ ...prev, isPwned: false, pwnedCount: 0 }));
        }
    } catch (error) {
        console.error('Error checking pwned password:', error);
        setPasswordValidation(prev => ({ ...prev, isPwned: null, pwnedCount: 0 }));
    } finally {
        setIsCheckingPwned(false);
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    
    if (pwnedCheckTimeout.current) clearTimeout(pwnedCheckTimeout.current);
    pwnedCheckTimeout.current = window.setTimeout(() => {
      checkPwnedPassword(newPassword);
    }, 500); // Debounce API call
  };

  const validateDetails = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    if (!email.trim()) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email address.';
    
    if (!password.trim()) newErrors.password = 'Password is required.';
    else {
        const { length, uppercase, lowercase, specialChar, isPwned } = passwordValidation;
        if (!length || !uppercase || !lowercase || !specialChar) {
            newErrors.password = 'Password does not meet all strength requirements.';
        } else if (isPwned) {
            newErrors.password = 'This password is too common or has been exposed in a data breach. Please choose a more secure password.';
        }
    }

    if (!isLogin && !name.trim()) newErrors.name = 'Full Name is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (isLogin) {
      // --- Login Logic ---
      if (!email || !password) {
        setLoginError('Please enter both email and password.');
        return;
      }
      const success = login(email, password);
      if (success) {
        addToast('Signed in successfully!', 'success');
        navigate(from, { replace: true });
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } else {
      // --- Sign Up Logic (Step 1: Details) ---
      if (validateDetails()) {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        addToast(`An OTP has been sent to ${email}. (Demo OTP: ${newOtp})`, 'info');
        setSignupStep('otp');
      }
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otp === generatedOtp) {
        addToast('Account created successfully! Please sign in.', 'success');
        setName('');
        setEmail('');
        setPassword('');
        setOtp('');
        setErrors({});
        setSignupStep('details');
        setIsLogin(true);
    } else {
        setOtpError('Invalid OTP. Please check the code and try again.');
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof typeof errors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  const inputClass = (field: keyof typeof errors) => `
    block w-full rounded-md border bg-gray-50/50 p-3 text-black shadow-sm 
    transition-colors duration-200
    placeholder:text-gray-400 focus:outline-none focus:ring-0
    ${errors[field] || (field === 'email' && loginError) ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}
  `;

  return (
    <>
      <div className="h-full bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left Panel: Image Carousel */}
          <div className="hidden lg:block relative overflow-hidden">
             {loginImages.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'} ${index % 2 === 0 ? 'animate-kenburns-top-right' : 'animate-kenburns-bottom-left'}`}
                    style={{ backgroundImage: `url('${src}')` }}
                />
            ))}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
             <div className="relative z-10 flex flex-col justify-center items-center h-full p-16 text-white text-center">
               <h1 className="text-8xl font-black tracking-widest uppercase">XOID</h1>
               <p className="mt-4 text-2xl text-white/80 max-w-md">The intersection of comfort and high fashion.</p>
             </div>
          </div>

          {/* Right Panel: Form */}
          <div className="flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative">
            <Link 
                to="/" 
                className="absolute top-8 left-4 sm:left-6 lg:left-8 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Back to Home
            </Link>

            <div className="max-w-md w-full">
              {signupStep === 'otp' ? (
                <>
                  <div className="text-left mb-10">
                    <h2 className="text-4xl font-extrabold text-black">Verify Your Email</h2>
                    <p className="mt-2 text-gray-600">
                      Enter the 6-digit code we sent to <span className="font-semibold text-black">{email}</span>.
                    </p>
                  </div>
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="otp" className="sr-only">OTP</label>
                      <input
                        id="otp" name="otp" type="text" maxLength={6}
                        value={otp} onChange={(e) => { setOtp(e.target.value); setOtpError(''); }}
                        className="block w-full text-center tracking-[0.5em] text-lg font-semibold rounded-md border bg-gray-50/50 p-3 text-black shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-black"
                      />
                      {otpError && <p className="mt-2 text-sm text-center text-red-600">{otpError}</p>}
                    </div>
                    <div>
                      <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-gray-800">
                        Verify & Create Account
                      </button>
                    </div>
                    <div className="text-center">
                        <button type="button" onClick={() => setSignupStep('details')} className="text-sm font-medium text-gray-600 hover:text-black">
                            &larr; Back to details
                        </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-left mb-10">
                      <h2 className="text-4xl font-extrabold text-black">
                          {isLogin ? 'Welcome Back' : 'Create Your Account'}
                      </h2>
                      <p className="mt-2 text-gray-600">
                          {isLogin ? 'New to XOID?' : 'Already have an account?'}
                          <button
                            onClick={() => {
                              setIsLogin(!isLogin);
                              setErrors({});
                              setLoginError(null);
                              setSignupStep('details');
                            }}
                            className="font-semibold text-black hover:underline ml-2 focus:outline-none"
                          >
                            {isLogin ? 'Create an account' : 'Sign in'}
                          </button>
                      </p>
                  </div>

                  <div className="space-y-4">
                      <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
                      <SocialButton icon={<InstagramIcon />} label="Continue with Instagram" />
                  </div>

                  <div className="relative flex py-5 items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink mx-4 text-xs font-medium text-gray-500 uppercase">OR</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    <div 
                      className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                      style={{ maxHeight: isLogin ? 0 : nameFieldHeight }}
                    >
                      <div className="mb-6" ref={nameFieldRef}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input id="name" name="name" type="text" autoComplete="name" className={inputClass('name')}
                            placeholder="John Doe" value={name} onChange={handleInputChange(setName, 'name')} />
                        {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                      <input id="email-address" name="email" type="email" autoComplete="email" className={inputClass('email')}
                        placeholder="you@example.com" value={email} onChange={handleInputChange(setEmail, 'email')} />
                      {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                          <input id="password" name="password" type={isPasswordVisible ? 'text' : 'password'} autoComplete="current-password"
                            className={`${inputClass('password')} pr-10`} placeholder="••••••••"
                            value={password} onChange={isLogin ? handleInputChange(setPassword, 'password') : handlePasswordChange} />
                          <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setIsPasswordVisible(prev => !prev)} aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}>
                            {isPasswordVisible ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-1.263-1.263a3 3 0 00-4.242 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" /></svg>
                            )}
                          </button>
                        </div>
                        {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
                    </div>

                    {!isLogin && <PasswordStrengthIndicator validation={passwordValidation} isChecking={isCheckingPwned} />}
                    
                    {isLogin && (
                      <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-black focus:ring-0 focus:outline-none"/>
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                          </div>
                          <div className="text-sm">
                              <button type="button" onClick={() => setIsForgotPasswordModalOpen(true)} className="font-medium text-gray-600 hover:text-black hover:underline focus:outline-none">
                                  Forgot your password?
                              </button>
                          </div>
                      </div>
                      )}

                      {loginError && <p className="text-sm text-center text-red-600">{loginError}</p>}
                    
                    <div>
                      <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isForgotPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsForgotPasswordModalOpen(false)}>
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsForgotPasswordModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close"><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 className="text-2xl font-bold text-black mb-2">Reset Password</h2>
            <p className="text-sm text-gray-600 mb-6">Enter your email and we'll send a link to get you back into your account.</p>
            <form onSubmit={handlePasswordReset}>
              <div>
                <label htmlFor="reset-email" className="sr-only">Email address</label>
                <input id="reset-email" name="email" type="email" autoComplete="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-black focus:outline-none focus:ring-0 focus:border-black sm:text-sm" placeholder="Email address" />
              </div>
              <div className="mt-6">
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;