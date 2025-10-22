
import React from 'react';
import { FiltersState } from '../pages/ShopPage';

interface FiltersProps {
  filters: FiltersState;
  onFilterChange: (newFilters: Partial<FiltersState>) => void;
  onClear: () => void;
  availableColors: string[];
  availableSizes: string[];
  isMobile?: boolean;
  onClose?: () => void;
}

const colorMap: { [key: string]: string } = {
  Black: '#111827',
  White: '#ffffff',
  Cream: '#F3EFE9',
  'Light Blue': '#A7D5E1'
};

const priceRanges = [
  { label: 'All', value: '' },
  { label: '₹8000 - ₹10000', value: '8000-10000' },
  { label: '₹10000 - ₹12000', value: '10000-12000' },
  { label: '₹12000+', value: '12000-99999' },
];

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-6 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onClear, availableColors, availableSizes, isMobile, onClose }) => {
  
  const handleColorChange = (value: string) => {
    const currentValues = filters.colors;
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ colors: newValues });
  };

  const handleSizeChange = (value: string) => {
    const currentValues = filters.sizes;
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ sizes: newValues });
  };

  const handleClearAndClose = () => {
    onClear();
    if (onClose) onClose();
  };

  return (
    <div className={isMobile ? 'h-full flex flex-col' : 'p-6 rounded-lg bg-white border border-gray-200 sticky top-24'}>
      <div className={`flex justify-between items-center mb-4 ${isMobile ? 'p-6 border-b' : ''}`}>
        <h2 className="text-xl font-bold text-black">Filters</h2>
        {isMobile ? (
          <button onClick={onClose} className="text-gray-500 hover:text-black" aria-label="Close filters">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <button onClick={onClear} className="text-sm font-medium text-gray-600 hover:text-black hover:underline transition-colors">Clear All</button>
        )}
      </div>

      <div className={isMobile ? 'flex-grow overflow-y-auto px-6' : ''}>
        <FilterSection title="Price">
          {priceRanges.map(range => (
            <div key={range.value} className="flex items-center">
              <input
                id={`price-${range.value}`}
                name="price"
                type="radio"
                value={range.value}
                checked={filters.price === range.value}
                onChange={(e) => onFilterChange({ price: e.target.value })}
                className="h-4 w-4 border-gray-300 text-black focus:ring-0 focus:outline-none"
              />
              <label htmlFor={`price-${range.value}`} className="ml-3 block text-sm font-medium text-gray-700">
                {range.label}
              </label>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Size">
            <div className="flex flex-wrap gap-3">
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                    filters.sizes.includes(size)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                  }`}
                  aria-pressed={filters.sizes.includes(size)}
                >
                  {size}
                </button>
              ))}
            </div>
        </FilterSection>

        <FilterSection title="Color">
            <div className="flex flex-wrap gap-3">
              {availableColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border border-gray-300 focus:outline-none transition-transform transform hover:scale-110 ${filters.colors.includes(color) ? 'ring-2 ring-offset-1 ring-black' : ''}`}
                  style={{ backgroundColor: colorMap[color] || '#ccc' }}
                  aria-label={`Filter by color ${color}`}
                  aria-pressed={filters.colors.includes(color)}
                />
              ))}
            </div>
        </FilterSection>
      </div>
      
      {isMobile && (
        <div className="p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="w-full bg-black text-white font-bold py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
           <button onClick={handleClearAndClose} className="w-full mt-3 text-sm text-gray-600 font-medium">Clear All</button>
        </div>
      )}
    </div>
  );
};

export default Filters;
