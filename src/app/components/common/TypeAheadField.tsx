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
  const [isLastTagHighlighted, setIsLastTagHighlighted] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
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

    // Reset highlight state when user starts typing
    if (newInputValue && isLastTagHighlighted) {
      setIsLastTagHighlighted(false);
    }

    if (newInputValue) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.label.toLowerCase().includes(newInputValue.toLowerCase()) &&
        !selectedValues.includes(suggestion.value)
      );
      setFilteredSuggestions(filtered);
      setIsOpen(true);
      setHighlightedIndex(-1);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '' && selectedValues.length > 0) {
      e.preventDefault();

      if (isLastTagHighlighted) {
        // Second backspace - delete the last tag
        handleRemoveValue(selectedValues[selectedValues.length - 1]);
        setIsLastTagHighlighted(false);
      } else {
        // First backspace - highlight the last tag
        setIsLastTagHighlighted(true);
      }
    } else if (e.key === 'ArrowDown' && isOpen && filteredSuggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp' && isOpen && filteredSuggestions.length > 0) {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter' && isOpen && highlightedIndex >= 0) {
      e.preventDefault();
      const selectedSuggestion = filteredSuggestions[highlightedIndex];
      if (selectedSuggestion) {
        handleSuggestionClick(selectedSuggestion);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key !== 'Backspace') {
      // Reset highlight state for any other key
      setIsLastTagHighlighted(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const newSelectedValues = [...selectedValues, suggestion.value];
    setSelectedValues(newSelectedValues);
    setInputValue('');
    setIsLastTagHighlighted(false);
    setHighlightedIndex(-1);

    const event = {
      target: {
        name,
        value: newSelectedValues.join(',')
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
    setIsOpen(false);

    // Focus the input field after adding a tag
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleRemoveValue = (valueToRemove: string) => {
    const newSelectedValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newSelectedValues);
    setIsLastTagHighlighted(false);

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
          {selectedValues.map((value, index) => {
            const suggestion = suggestions.find(s => s.value.toLowerCase() === value.trim().toLowerCase());
            const isHighlighted = isLastTagHighlighted && index === selectedValues.length - 1;
            return (
              <span
                key={value}
                className={`inline-flex items-center px-2 py-1 rounded-md text-sm ${
                  isHighlighted
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {suggestion?.label}
                <button
                  type="button"
                  className={`ml-1 ${
                    isHighlighted
                      ? 'text-red-500 hover:text-red-700'
                      : 'text-blue-500 hover:text-blue-700'
                  }`}
                  onClick={() => handleRemoveValue(value)}
                >
                  ×
                </button>
              </span>
            );
          })}
          <input
            ref={inputRef}
            type="text"
            id={name}
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required && selectedValues.length === 0}
            className={`flex-1 min-w-[120px] outline-none border-none bg-transparent focus:border-none focus:outline-none focus:ring-0 ${error ? 'border-red-500' : ''} ${className}`}
          />
        </div>
        {isOpen && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.value}-${index}`}
                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                  index === highlightedIndex
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-blue-50'
                }`}
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