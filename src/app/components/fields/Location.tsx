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
  countryLabel?: string;
  cityLabel?: string;
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

const Location: React.FC<LocationProps> = ({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  required,
  layout = 'vertical',
  countryLabel = "Country",
  cityLabel = "City"
}) => {
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [previousCountryId, setPreviousCountryId] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasSetDefaultCountry, setHasSetDefaultCountry] = useState(false);

  // Load initial countries data
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchDropdownOptions('locations') as unknown as LocationOption[];

        const uniqueCountries = Array.from(
          new Map(
            data
              .filter(loc => loc.countryId !== null)
              .map(loc => [`${loc.countryId}`, { value: loc.countryId.toString(), label: loc.country }])
          ).values()
        );

        setCountries(uniqueCountries);

        // Find India's country ID if not already set and this is the initial load
        if (!formData.countryId && !hasSetDefaultCountry && isInitialLoad) {
          const indiaLocation = data.find(loc => loc.country === 'India');
          if (indiaLocation && indiaLocation.countryId) {
            // Set India as default country only on initial load
            onInputChange({
              target: {
                name: 'countryId',
                value: indiaLocation.countryId.toString()
              }
            } as React.ChangeEvent<HTMLSelectElement>);
            setHasSetDefaultCountry(true);
          }
        }

        // Handle initial city loading if we have both country and city
        if (formData.countryId && formData.cityId) {
          const countryLocations = data.filter(loc =>
            loc.countryId !== null && loc.countryId.toString() === formData.countryId
          );
          const uniqueCities = Array.from(
            new Map(
              countryLocations
                .filter(loc => loc.cityId !== null)
                .map(loc => [`${loc.cityId}`, { value: loc.cityId.toString(), label: loc.city }])
            ).values()
          );

          setCities(uniqueCities);
          setPreviousCountryId(formData.countryId);
        }
        setTimeout(() => {
          setIsInitialLoad(false);
        }, 1000);
      } catch (err) {
        console.error('Failed to fetch location data:', err);
        toast.error('Failed to load location data. Please try again.');
      }
    };

    loadCountries();
  }, [formData.countryId, formData.cityId, onInputChange]);

  // Handle country change and update cities
  useEffect(() => {
    const updateCities = async () => {
      if (formData.countryId !== previousCountryId && !isInitialLoad) {
        console.log('updateCities', formData.countryId, previousCountryId);
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

        if (formData.countryId) {
          try {
            const data = await fetchDropdownOptions('locations') as unknown as LocationOption[];
            const countryLocations = data.filter(loc =>
              loc.countryId !== null && loc.countryId.toString() === formData.countryId
            );
            const uniqueCities = Array.from(
              new Map(
                countryLocations
                  .filter(loc => loc.cityId !== null)
                  .map(loc => [`${loc.cityId}`, { value: loc.cityId.toString(), label: loc.city }])
              ).values()
            );

            setCities(uniqueCities);
          } catch (err) {
            console.error('Failed to fetch cities:', err);
            toast.error('Failed to load cities. Please try again.');
          }
        } else {
          setCities([]);
        }
        setIsLoadingCities(false);
      }
    };

    updateCities();
  }, [formData.countryId, formData.cityId, isInitialLoad, onInputChange, previousCountryId]);

  // Custom handler for country field to update countryId
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('handleCountryChange', e);
    onInputChange(e);
  };

  // Custom handler for city field to update cityId
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('handleCityChange', e);
    onInputChange(e);
  };

  const containerClass = layout === 'horizontal' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4';

  return (
    <div className={`w-full ${containerClass}`}>
      <SelectField
        label={countryLabel}
        name="countryId"
        options={countries}
        value={formData.countryId || ''}
        onChange={handleCountryChange}
        onBlur={() => onBlur('countryId')}
        error={touched.countryId ? errors.countryId : undefined}
        required={required}
      />

      <SelectField
        label={cityLabel}
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

export default Location;

