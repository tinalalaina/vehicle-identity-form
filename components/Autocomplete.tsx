import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FetchStatus } from '../types';

interface AutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  onSearch?: (query: string) => Promise<string[]>; // For async options
  allowCustom?: boolean;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string;
  id: string;
  commitOnType?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  onSearch,
  allowCustom = true,
  disabled = false,
  loading = false,
  required = false,
  error,
  id,
  commitOnType = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [internalLoading, setInternalLoading] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal input with prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input locally first
  useEffect(() => {
    const lowerInput = inputValue.toLowerCase();
    const localFiltered = options.filter(opt => 
      opt.toLowerCase().includes(lowerInput)
    );
    setFilteredOptions(localFiltered);
  }, [inputValue, options]);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If we closed and the input value isn't exactly a valid option, 
        // we assume the user might want that value if allowCustom is true,
        // otherwise we might reset (but for this form, we usually want to keep what they typed)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);

    if (commitOnType && allowCustom) {
      onChange(newValue);
    }
    
    // If user clears input, verify we clear the parent state too if desired, 
    // or wait for selection. Here we just update the input view.
    if (newValue === '') {
        onChange('');
    }

    if (onSearch && newValue.length > 2) {
      setInternalLoading(true);
      try {
        const results = await onSearch(newValue);
        if (results.length > 0) {
            // Merge with static options to show both
            setFilteredOptions(prev => Array.from(new Set([...prev, ...results])));
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setInternalLoading(false);
      }
    }
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleCustomAdd = () => {
    onChange(inputValue);
    setIsOpen(false);
  };

  const isLoading = loading || internalLoading;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span>*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && allowCustom && inputValue.trim()) {
              e.preventDefault();
              onChange(inputValue.trim());
              setIsOpen(false);
            }
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm
            ${error 
              ? 'border-red-300 focus:ring-red-200 bg-red-50/30' 
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white'
            }
            ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}
          `}
          autoComplete="off"
        />
        
        {/* Chevron Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
           {isLoading ? (
             <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
           ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
           )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500 font-medium">
          {error}
        </p>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-64 overflow-y-auto overflow-x-hidden">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li 
                  key={`${option}-${index}`}
                  onClick={() => handleSelectOption(option)}
                  className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-slate-700 text-sm font-medium transition-colors"
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-slate-500 text-sm text-center">
              Aucun résultat trouvé.
            </div>
          )}

          {/* Custom Add Option */}
          {allowCustom && inputValue && !filteredOptions.includes(inputValue) && (
             <div 
                onClick={handleCustomAdd}
                className="border-t border-slate-100 px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer text-blue-600 text-sm font-semibold flex items-center justify-center gap-2 transition-colors sticky bottom-0"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter "{inputValue}"
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
