import React from 'react';

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div className="relative group">
      <label htmlFor={id} className="sr-only">{label}</label>
      <select
        id={id}
        className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-black transition-colors duration-200 hover:border-gray-400 focus:border-black focus:outline-none focus:ring-0"
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500 transition-colors group-hover:text-black">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default CustomSelect;