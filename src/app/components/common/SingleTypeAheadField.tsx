import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Suggestion {
  value: string;
  label: string;
}

interface SingleTypeAheadFieldProps {
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
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  maxResults?: number;
  debounceMs?: number;
  openByDefault?: boolean;
  showSuggestionsOnEmpty?: boolean;
  idRequired?: boolean;
}

const SingleTypeAheadField: React.FC<SingleTypeAheadFieldProps> = ({
  label,
  name,
  placeholder,
  required,
  value,
  onChange,
  onBlur,
  error,
  suggestions,
  className = '',
  onSuggestionSelect,
  maxResults = 50,
  debounceMs = 150,
  openByDefault = false,
  showSuggestionsOnEmpty = false,
  idRequired = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Optimized filtering function with early exit and result limiting
  const filterSuggestions = useCallback((inputValue: string): Suggestion[] => {
    if (!inputValue.trim()) return [];

    const lowerInput = inputValue.toLowerCase();
    const prefixMatches: Suggestion[] = [];
    const containsMatches: Suggestion[] = [];

    // Use for...of for better performance than filter and keep stable ordering
    for (const suggestion of suggestions) {
      const lowerLabel = suggestion.label.toLowerCase();

      if (lowerLabel.startsWith(lowerInput)) {
        // Keep original order for prefix matches
        prefixMatches.push(suggestion);
      } else if (lowerLabel.includes(lowerInput)) {
        containsMatches.push(suggestion);
      }

      // Early exit when we have enough combined results
      if (prefixMatches.length + containsMatches.length >= maxResults) {
        break;
      }
    }

    return [...prefixMatches, ...containsMatches].slice(0, maxResults);
  }, [suggestions, maxResults]);

  // Open suggestions by default if requested
  useEffect(() => {
    if (!openByDefault) return;
    const hasPrefilledValue = Boolean(value && value.trim());
    if (hasPrefilledValue) {
      const filtered = filterSuggestions(value);
      setFilteredSuggestions(filtered);
      setIsOpen(true);
      setSelectedIndex(filtered.length > 0 ? 0 : -1);
    } else {
      const initial = showSuggestionsOnEmpty ? suggestions.slice(0, maxResults) : [];
      setFilteredSuggestions(initial);
      setIsOpen(showSuggestionsOnEmpty && initial.length > 0);
      setSelectedIndex(initial.length > 0 ? 0 : -1);
    }
  }, [openByDefault, value, showSuggestionsOnEmpty, suggestions, maxResults, filterSuggestions]);

  const handleInputFocus = () => {
    // Scroll the field into view with some offset to make space for dropdown
    setTimeout(() => {
      wrapperRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(e);

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (inputValue) {
      // Debounce the filtering
      debounceTimeoutRef.current = setTimeout(() => {
        const filtered = filterSuggestions(inputValue);
        setFilteredSuggestions(filtered);
        setIsOpen(true);
        setSelectedIndex(-1);
      }, debounceMs);
    } else {
      const initial = showSuggestionsOnEmpty ? suggestions.slice(0, maxResults) : [];
      setFilteredSuggestions(initial);
      setIsOpen(openByDefault || (showSuggestionsOnEmpty && initial.length > 0));
      setSelectedIndex(initial.length > 0 ? 0 : -1);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      const event = {
        target: {
          name,
          value: suggestion.label
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleBlur = () => {
    console.log('handleBlur', value, idRequired);

    // If idRequired is false, hide the listing without any conditions
    if (!idRequired) {
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (value.trim()) {
      // If idRequired is true, check if the current value matches any suggestion
      console.log('value', value);
      // console.log('suggestions', suggestions);
      const exactMatch = suggestions.find(suggestion =>
        suggestion.label.toLowerCase() === value.toLowerCase()
      );
      console.log('exactMatch', exactMatch);

      if (exactMatch) {
        // If exact match found, set the value to the suggestion label and hide dropdown
        const event = {
          target: {
            name,
            value: exactMatch.label
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
        setIsOpen(false);
        setSelectedIndex(-1);
      } else {
        // If no exact match found, hide the dropdown
        // setIsOpen(false);
        // setSelectedIndex(-1);
      }
    }

    // Call the original onBlur if provided
    if (onBlur) {
      onBlur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="space-y-1" ref={wrapperRef}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete='off'
          className={`block h-12 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${error ? 'border-red-500' : ''} ${className}`}
        />
        {isOpen && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.value}-${index}`}
                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                  index === selectedIndex
                    ? 'bg-blue-600 text-white'
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

export default SingleTypeAheadField;