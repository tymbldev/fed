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
  onBlur
}) => {
  const [locationData, setLocationData] = useState<LocationOption[]>([]);
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [previousCountryId, setPreviousCountryId] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchDropdownOptions('locations') as unknown as LocationOption[];
        setLocationData(data);

        const uniqueCountries = Array.from(
          new Map(
            data
              .filter(loc => loc.countryId !== null)
              .map(loc => [`${loc.countryId}`, { value: loc.countryId.toString(), label: loc.country }])
          ).values()
        );

        setCountries(uniqueCountries);
      } catch (err) {
        console.error('Failed to fetch location data:', err);
        toast.error('Failed to load location data. Please try again.');
      }
    };

    loadLocations();
  }, []);

  // Effect to handle initial city loading and prefilling
  useEffect(() => {
    if (locationData.length > 0 && formData.countryId && formData.cityId && isInitialLoad) {
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

      setCities(uniqueCities);
      setPreviousCountryId(formData.countryId);
      setIsInitialLoad(false);
    }
  }, [locationData, formData.countryId, formData.cityId, isInitialLoad]);

  useEffect(() => {
    const updateCities = async () => {
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

          setCities(uniqueCities);
        } else {
          setCities([]);
        }
        setIsLoadingCities(false);
      }
    };

    updateCities();
  }, [formData.countryId, locationData, onInputChange, previousCountryId, isInitialLoad]);

  // Custom handler for country field to update countryId
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onInputChange(e);
  };

  // Custom handler for city field to update cityId
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onInputChange(e);
  };

  return (
    <div className="space-y-4">
      <SelectField
        label="Country"
        name="countryId"
        options={countries}
        value={formData.countryId || ''}
        onChange={handleCountryChange}
        onBlur={() => onBlur('country')}
        error={touched.country ? errors.country : undefined}
        required
        className="mb-4"
      />

      <SelectField
        label="City"
        name="cityId"
        options={cities}
        value={formData.cityId || ''}
        onChange={handleCityChange}
        onBlur={() => onBlur('city')}
        error={touched.city ? errors.city : undefined}
        required
        className="mb-4"
        disabled={isLoadingCities || !formData.countryId}
      />
    </div>
  );
};

export default Location;

