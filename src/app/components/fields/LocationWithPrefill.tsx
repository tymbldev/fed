import React, { useState, useEffect } from 'react';
import SelectField from '../common/SelectField';
import { fetchDropdownOptions } from '../../services/api';
import { toast } from 'sonner';

interface LocationProps {
  formData: { [key: string]: string };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (field: string) => void;
  required?: boolean;
  layout?: 'horizontal' | 'vertical';
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

const LocationWithPrefill: React.FC<LocationProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required,
  layout = 'vertical'
}) => {
  const [locationData, setLocationData] = useState<LocationOption[]>([]);
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [previousCountryId, setPreviousCountryId] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [prefilledCity, setPrefilledCity] = useState<{ value: string; label: string } | null>(null);

  // Load countries and find pre-filled city on initial render
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchDropdownOptions('locations') as unknown as LocationOption[];
        setLocationData(data);

        // Extract countries
        const uniqueCountries = Array.from(
          new Map(
            data
              .filter(loc => loc.countryId !== null)
              .map(loc => [`${loc.countryId}`, { value: loc.countryId.toString(), label: loc.country }])
          ).values()
        );
        setCountries(uniqueCountries);

        // If we have a pre-filled city, find its data
        if (formData.cityId) {
          const cityData = data.find(loc =>
            loc.cityId !== null && loc.cityId.toString() === formData.cityId
          );

          if (cityData) {
            setPrefilledCity({
              value: cityData.cityId.toString(),
              label: cityData.city
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch location data:', err);
        toast.error('Failed to load location data. Please try again.');
      }
    };

    loadLocations();
  }, [formData.cityId]);

  // Handle initial load with pre-filled data
  useEffect(() => {
    if (locationData.length > 0 && isInitialLoad) {
      // If we have a country, load cities for that country
      if (formData.countryId) {
        const countryLocations = locationData.filter(loc =>
          loc.countryId !== null && loc.countryId.toString() === formData.countryId
        );

        const uniqueCities = Array.from(
          new Map(
            countryLocations
              .filter(loc => loc.cityId !== null)
              .map(loc => [`${loc.cityId}`, { value: loc.cityId.toString(), label: loc.city }])
          ).values()
        );

        // If we have a pre-filled city and it's not in the list, add it
        if (prefilledCity && !uniqueCities.some(city => city.value === prefilledCity.value)) {
          uniqueCities.push(prefilledCity);
        }

        setCities(uniqueCities);
        setPreviousCountryId(formData.countryId);
      }

      // Mark initial load as complete
      setIsInitialLoad(false);
    }
  }, [locationData, formData.countryId, isInitialLoad, prefilledCity]);

  // Handle country changes
  useEffect(() => {
    if (formData.countryId !== previousCountryId && !isInitialLoad) {
      setPreviousCountryId(formData.countryId);
      setIsLoadingCities(true);

      // Reset city when country changes
      if (formData.cityId) {
        onInputChange({
          target: {
            name: 'cityId',
            value: ''
          }
        } as React.ChangeEvent<HTMLSelectElement>);
      }

      // Update cities based on selected country
      if (formData.countryId) {
        const countryLocations = locationData.filter(loc =>
          loc.countryId !== null && loc.countryId.toString() === formData.countryId
        );

        const uniqueCities = Array.from(
          new Map(
            countryLocations
              .filter(loc => loc.cityId !== null)
              .map(loc => [`${loc.cityId}`, { value: loc.cityId.toString(), label: loc.city }])
          ).values()
        );

        // If we have a pre-filled city and it's not in the list, add it
        if (prefilledCity && !uniqueCities.some(city => city.value === prefilledCity.value)) {
          uniqueCities.push(prefilledCity);
        }

        setCities(uniqueCities);
      } else {
        setCities([]);
      }

      setIsLoadingCities(false);
    }
  }, [formData.countryId, locationData, onInputChange, previousCountryId, isInitialLoad, prefilledCity]);

  // Custom handler for country field to update countryId
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onInputChange(e);
  };

  // Custom handler for city field to update cityId
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onInputChange(e);
  };

  const containerClass = layout === 'horizontal' ? 'grid grid-cols-2 gap-4' : 'space-y-4';

  return (
    <div className={containerClass}>
      <SelectField
        label="Country"
        name="countryId"
        options={countries}
        value={formData.countryId || ''}
        onChange={handleCountryChange}
        onBlur={() => onBlur('countryId')}
        error={touched.countryId ? errors.countryId : undefined}
        required={required}
      />

      <SelectField
        label="City"
        name="cityId"
        options={cities}
        value={formData.cityId || ''}
        onChange={handleCityChange}
        onBlur={() => onBlur('cityId')}
        error={touched.cityId ? errors.cityId : undefined}
        required={required}
        disabled={isLoadingCities || !formData.countryId}
      />
    </div>
  );
};

export default LocationWithPrefill;