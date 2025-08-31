import React, { useEffect, useMemo, useState } from 'react';
import SingleTypeAheadField from '../../common/SingleTypeAheadField';
import { fetchDropdownOptions } from '../../../services/api';
import { toast } from 'sonner';
import { LocationOption } from '../../../types/common';

interface LocationProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  label?: string;
}



const LocationTypeahead: React.FC<LocationProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  label = 'Location'
}) => {
  const [locationData, setLocationData] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const raw = await fetchDropdownOptions('locations') as unknown as unknown[];
        // Use the full LocationOption type directly
        const normalized: LocationOption[] = (Array.isArray(raw) ? raw : []).filter((item: unknown) => {
          const obj = item as { city?: unknown; country?: unknown };
          const cityVal = typeof obj.city === 'string' ? obj.city : '';
          const countryVal = typeof obj.country === 'string' ? obj.country : '';
          return cityVal.trim() || countryVal.trim();
        }) as LocationOption[];
        setLocationData(normalized);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        toast.error('Failed to load locations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Prepare unique lists and quick lookups (by names only)
  const suggestions = useMemo(() => {
    const countrySet = new Set<string>();
    const cityCountrySet = new Set<string>();

    for (const loc of locationData) {
      if (loc.country) countrySet.add(loc.country);
      const ccKey = `${loc.city}||${loc.country}`; // use delimiter unlikely in names
      if (loc.city) cityCountrySet.add(ccKey);
    }

    const countrySuggestions = Array.from(countrySet).map(country => ({
      value: `country:${country}`,
      label: country
    }));

    const citySuggestions = Array.from(cityCountrySet).map(key => {
      const [city, country] = key.split('||');
      return {
        value: `city:${city}||${country}`,
        label: country ? `${city}, ${country}` : city
      };
    });

    return [...citySuggestions, ...countrySuggestions];
  }, [locationData]);

  // No automatic defaulting of location value

  // Store the raw single input value; parent will derive city/country on submit
  const handleFreeTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value || '';
    onInputChange({ target: { name: 'location', value: rawInput } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSuggestionSelect = (suggestion: { value: string; label: string }) => {
    // Put selected label into the single location field
    onInputChange({ target: { name: 'location', value: suggestion.label } } as React.ChangeEvent<HTMLInputElement>);
  };

  // Single raw value kept in parent under `location`
  const combinedValue = useMemo(() => {
    return (formData.location || '').trim();
  }, [formData.location]);

  return (
    <div className="w-full">
      <SingleTypeAheadField
        label={label}
        name="location"
        placeholder={isLoading ? 'Loading locations...' : 'Type a city or country'}
        value={combinedValue}
        onChange={handleFreeTextChange}
        onBlur={() => onBlur('location')}
        error={touched.location ? errors.location : undefined}
        suggestions={suggestions}
        required={required}
        onSuggestionSelect={handleSuggestionSelect}
        maxResults={100}
        debounceMs={150}
        openByDefault={false}
        showSuggestionsOnEmpty
        idRequired={false}
      />
    </div>
  );
};

export default LocationTypeahead;




