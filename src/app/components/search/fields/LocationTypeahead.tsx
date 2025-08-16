import React, { useEffect, useMemo, useState } from 'react';
import SingleTypeAheadField from '../../common/SingleTypeAheadField';
import { fetchDropdownOptions } from '../../../services/api';
import { toast } from 'sonner';

interface LocationProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  label?: string;
  autoDefaultToIndia?: boolean;
}

interface LocationOption {
  id: number;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string;
  cityId: number;
  country: string;
  countryId: number;
  displayName: string;
  locationDisplay: string;
  remote: boolean;
  state: string;
  zipCode: string;
}

const LocationTypeahead: React.FC<LocationProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required = false,
  label = 'Location',
  autoDefaultToIndia = false
}) => {
  const [locationData, setLocationData] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDropdownOptions('locations') as unknown as LocationOption[];
        setLocationData(data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        toast.error('Failed to load locations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Prepare unique lists and quick lookups
  const { suggestions, cityIdToSample, countryIdToName } = useMemo(() => {
    const cityMap = new Map<string, LocationOption>();
    const countryMap = new Map<string, string>();

    for (const loc of locationData) {
      if (loc.cityId != null) {
        const key = `${loc.cityId}`;
        if (!cityMap.has(key)) cityMap.set(key, loc);
      }
      if (loc.countryId != null) {
        const ckey = `${loc.countryId}`;
        if (!countryMap.has(ckey)) countryMap.set(ckey, loc.country);
      }
    }

    // Countries suggestions
    const countrySuggestions = Array.from(countryMap.entries()).map(([countryId, countryName]) => ({
      value: `country:${countryId}`,
      label: countryName
    }));

    // City suggestions as "City, Country"
    const citySuggestions = Array.from(cityMap.values()).map(sample => ({
      value: `city:${sample.cityId}`,
      label: `${sample.city}, ${sample.country}`
    }));

    return {
      suggestions: [...citySuggestions, ...countrySuggestions],
      cityIdToSample: cityMap,
      countryIdToName: countryMap
    };
  }, [locationData]);

  // Optionally default to India if requested and no location set
  useEffect(() => {
    if (!autoDefaultToIndia) return;
    if (!locationData.length) return;
    if (formData.country || formData.city || (formData as any).countryId || (formData as any).cityId) return;

    const india = locationData.find(l => l.country === 'India');
    if (india) {
      onInputChange({
        target: { name: 'country', value: india.country }
      } as React.ChangeEvent<HTMLInputElement>);
      onInputChange({
        target: { name: 'countryId', value: String(india.countryId) }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [autoDefaultToIndia, locationData, formData.country, formData.city, (formData as any).countryId, (formData as any).cityId, onInputChange]);

  // Free-text typing should set city text and clear IDs/country unless explicitly chosen
  const handleFreeTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Update combined via city field (used for SEO if country empty)
    onInputChange({
      target: { name: 'city', value: inputValue }
    } as React.ChangeEvent<HTMLInputElement>);

    // Clear mappings when user types free text
    onInputChange({ target: { name: 'cityId', value: '' } } as React.ChangeEvent<HTMLInputElement>);
    onInputChange({ target: { name: 'countryId', value: '' } } as React.ChangeEvent<HTMLInputElement>);
    if (!inputValue) {
      onInputChange({ target: { name: 'country', value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleSuggestionSelect = (suggestion: { value: string; label: string }) => {
    if (suggestion.value.startsWith('country:')) {
      const countryId = suggestion.value.split(':')[1];
      const countryName = countryIdToName.get(countryId) || suggestion.label;

      // Set country fields and clear city
      onInputChange({ target: { name: 'countryId', value: countryId } } as React.ChangeEvent<HTMLInputElement>);
      onInputChange({ target: { name: 'country', value: countryName } } as React.ChangeEvent<HTMLInputElement>);
      onInputChange({ target: { name: 'cityId', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      onInputChange({ target: { name: 'city', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      return;
    }

    if (suggestion.value.startsWith('city:')) {
      const cityId = suggestion.value.split(':')[1];
      const sample = cityIdToSample.get(cityId);
      if (sample) {
        onInputChange({ target: { name: 'cityId', value: String(sample.cityId) } } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({ target: { name: 'city', value: sample.city } } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({ target: { name: 'countryId', value: String(sample.countryId) } } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({ target: { name: 'country', value: sample.country } } as React.ChangeEvent<HTMLInputElement>);
      } else {
        // Fallback: set city text from label (before comma)
        const [cityText, countryText] = suggestion.label.split(',').map(s => s.trim());
        onInputChange({ target: { name: 'city', value: cityText || suggestion.label } } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({ target: { name: 'country', value: countryText || '' } } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({ target: { name: 'cityId', value: '' } } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({ target: { name: 'countryId', value: '' } } as React.ChangeEvent<HTMLInputElement>);
      }
      return;
    }

    // Default: treat as free text
    onInputChange({ target: { name: 'city', value: suggestion.label } } as React.ChangeEvent<HTMLInputElement>);
    onInputChange({ target: { name: 'cityId', value: '' } } as React.ChangeEvent<HTMLInputElement>);
    onInputChange({ target: { name: 'country', value: '' } } as React.ChangeEvent<HTMLInputElement>);
    onInputChange({ target: { name: 'countryId', value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  // Value shown in the single input combines city and country
  const combinedValue = useMemo(() => {
    const city = (formData.city || '').trim();
    const country = (formData.country || '').trim();
    if (city && country) return `${city}, ${country}`;
    return city || country || '';
  }, [formData.city, formData.country]);

  return (
    <div className="w-full">
      <SingleTypeAheadField
        label={label}
        name="location"
        placeholder={isLoading ? 'Loading locations...' : 'Type a city or country'}
        value={combinedValue}
        onChange={handleFreeTextChange}
        onBlur={() => onBlur('city')}
        error={touched.city ? errors.city : undefined}
        suggestions={suggestions}
        required={required}
        onSuggestionSelect={handleSuggestionSelect}
        maxResults={100}
        debounceMs={150}
      />
    </div>
  );
};

export default LocationTypeahead;




