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
  setValue?: boolean; // If true, will update both ID and label fields
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
  cityLabel = "City",
  setValue = false
}) => {
  const [locationData, setLocationData] = useState<LocationOption[]>([]);
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [previousCountryId, setPreviousCountryId] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load location data once on component mount
  useEffect(() => {
    const loadLocationData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDropdownOptions('locations') as unknown as LocationOption[];
        setLocationData(data);
      } catch (err) {
        console.error('Failed to fetch location data:', err);
        toast.error('Failed to load location data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLocationData();
  }, []); // Only run once on mount

    // Process countries from cached location data
  useEffect(() => {
    if (locationData.length === 0) return;

    const uniqueCountries = Array.from(
      new Map(
        locationData
          .filter(loc => loc.countryId !== null)
          .map(loc => [`${loc.countryId}`, { value: loc.countryId.toString(), label: loc.country }])
      ).values()
    );

    setCountries(uniqueCountries);

    // Handle initial city loading if we have both country and city
    if (formData.countryId && formData.cityId) {
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
    }

    setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
  }, [locationData, formData.countryId, formData.cityId]);

  // No automatic defaulting of country

  // Handle country change and update cities from cached data
  useEffect(() => {
    if (locationData.length === 0) return;

    if (formData.countryId !== previousCountryId && !isInitialLoad) {
      // console.log('updateCities', formData.countryId, previousCountryId);
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

        // If setValue is true, also clear the city label
        if (setValue) {
          onInputChange({
            target: {
              name: 'city',
              value: ''
            }
          } as React.ChangeEvent<HTMLSelectElement>);
        }
      }

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
  }, [formData.countryId, formData.cityId, isInitialLoad, onInputChange, previousCountryId, locationData, setValue]);

  // Custom handler for country field to update countryId and optionally country label
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('handleCountryChange', e);
    onInputChange(e);

    // If setValue is true, also update the country label
    if (setValue) {
      if (e.target.value) {
        const selectedCountry = countries.find(country => country.value === e.target.value);
        if (selectedCountry) {
          onInputChange({
            target: {
              name: 'country',
              value: selectedCountry.label
            }
          } as React.ChangeEvent<HTMLSelectElement>);
        }
      } else {
        // Clear country label when country is deselected
        onInputChange({
          target: {
            name: 'country',
            value: ''
          }
        } as React.ChangeEvent<HTMLSelectElement>);
      }
    }
  };

  // Custom handler for city field to update cityId and optionally city label
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('handleCityChange', e);
    onInputChange(e);

    // If setValue is true, also update the city label
    if (setValue) {
      if (e.target.value) {
        const selectedCity = cities.find(city => city.value === e.target.value);
        if (selectedCity) {
          onInputChange({
            target: {
              name: 'city',
              value: selectedCity.label
            }
          } as React.ChangeEvent<HTMLSelectElement>);
        }
      } else {
        // Clear city label when city is deselected
        onInputChange({
          target: {
            name: 'city',
            value: ''
          }
        } as React.ChangeEvent<HTMLSelectElement>);
      }
    }
  };

  const containerClass = layout === 'horizontal' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4';

  // Show loading state while fetching initial data
  if (isLoading) {
    return (
      <div className={`w-full ${containerClass}`}>
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

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

