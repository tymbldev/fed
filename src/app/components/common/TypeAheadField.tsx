import React, { useState, useRef, useEffect } from 'react';

interface Suggestion {
  value: string;
  label: string;
}

interface TypeAheadFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  suggestions: Suggestion[];
  className?: string;
}

const TypeAheadField: React.FC<TypeAheadFieldProps> = ({
  label,
  name,
  placeholder,
  required,
  value,
  onChange,
  onBlur,
  error,
  suggestions,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedValues(value.split(','));
    } else {
      setSelectedValues([]);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);

    if (newInputValue) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.label.toLowerCase().includes(newInputValue.toLowerCase()) &&
        !selectedValues.includes(suggestion.value)
      );
      setFilteredSuggestions(filtered);
      setIsOpen(true);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const newSelectedValues = [...selectedValues, suggestion.value];
    setSelectedValues(newSelectedValues);
    setInputValue('');

    const event = {
      target: {
        name,
        value: newSelectedValues.join(',')
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
    setIsOpen(false);
  };

  const handleRemoveValue = (valueToRemove: string) => {
    const newSelectedValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newSelectedValues);

    const event = {
      target: {
        name,
        value: newSelectedValues.join(',')
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className="space-y-1" ref={wrapperRef}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-2 border rounded-md">
          {selectedValues.map((value) => {
            const suggestion = suggestions.find(s => s.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-700"
              >
                {suggestion?.label}
                <button
                  type="button"
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  onClick={() => handleRemoveValue(value)}
                >
                  ×
                </button>
              </span>
            );
          })}
          <input
            type="text"
            id={name}
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={onBlur}
            placeholder={selectedValues.length === 0 ? placeholder : ''}
            required={required && selectedValues.length === 0}
            className={`flex-1 min-w-[120px] outline-none ${error ? 'border-red-500' : ''} ${className}`}
          />
        </div>
        {isOpen && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.value}-${index}`}
                className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-blue-50"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TypeAheadField;