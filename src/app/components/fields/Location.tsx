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
  cityId: number | null;
  country: string;
  countryId: number | null;
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
  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [showCity, setShowCity] = useState(false);
  const [previousCountry, setPreviousCountry] = useState('');

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchDropdownOptions('locations') as unknown as LocationOption[];
        setLocationData(data);

        // Extract unique countries
        const uniqueCountries = Array.from(
          new Set(data.map(loc => loc.country))
        ).map(country => ({
          value: country,
          label: country
        }));
        setCountries(uniqueCountries);
      } catch (err) {
        console.error('Failed to fetch location data:', err);
        toast.error('Failed to load location data. Please try again.');
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    // Only reset city if country has changed
    if (formData.country !== previousCountry) {
      setPreviousCountry(formData.country);

      // Reset city when country changes
      if (formData.city) {
        onInputChange({
          target: {
            name: 'city',
            value: ''
          }
        } as React.ChangeEvent<HTMLSelectElement>);
        onInputChange({
          target: {
            name: 'cityId',
            value: ''
          }
        } as React.ChangeEvent<HTMLSelectElement>);
      }
    }

    if (formData.country) {
      // Only fetch states if UK is selected
      if (formData.country === 'UK') {
        const countryLocations = locationData.filter(loc => loc.country === formData.country);
        const uniqueStates = Array.from(
          new Set(countryLocations.map(loc => loc.state))
        ).map(state => ({
          value: state,
          label: state
        }));
        setStates(uniqueStates);
      } else {
        // For non-UK countries, reset state and show city directly
        setStates([]);
        if (formData.state) {
          onInputChange({
            target: {
              name: 'state',
              value: ''
            }
          } as React.ChangeEvent<HTMLSelectElement>);
        }

        // For non-UK countries, fetch cities directly
        const countryLocations = locationData.filter(loc => loc.country === formData.country);
        const uniqueCities = Array.from(
          new Set(countryLocations.map(loc => loc.city))
        ).map(city => ({
          value: city,
          label: city
        }));

        setCities(uniqueCities);
        setShowCity(true);
      }

      // Only hide city if we're changing to UK and no state is selected yet
      if (formData.country === 'UK' && !formData.state) {
        setShowCity(false);
      }
    } else {
      setStates([]);
      setCities([]);
      setShowCity(false);
    }
  }, [formData.country, locationData, onInputChange, previousCountry]);

  useEffect(() => {
    if (formData.country === 'UK' && formData.state) {
      const stateLocations = locationData.filter(
        loc => loc.country === formData.country && loc.state === formData.state
      );
      const uniqueCities = Array.from(
        new Set(stateLocations.map(loc => loc.city))
      ).map(city => ({
        value: city,
        label: city
      }));

      setCities(uniqueCities);
      setShowCity(true);
    } else if (formData.country && formData.country !== 'UK') {
      // For non-UK countries, cities are already set in the previous useEffect
      setShowCity(true);
    }
  }, [formData.country, formData.state, locationData]);

  // Custom handler for country field to update both name and ID
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    const countryData = locationData.find(loc => loc.country === selectedCountry);

    // Update country name
    onInputChange(e);

    // Update country ID
    onInputChange({
      target: {
        name: 'countryId',
        value: countryData?.countryId?.toString() || ''
      }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  // Custom handler for city field to update both name and ID
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Ensure city field stays visible
    setShowCity(true);

    const selectedCity = e.target.value;
    const cityData = locationData.find(loc => loc.city === selectedCity);

    // Update city name
    onInputChange(e);

    // Update city ID
    onInputChange({
      target: {
        name: 'cityId',
        value: cityData?.cityId?.toString() || ''
      }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className="space-y-4">
      <SelectField
        label="Country"
        name="country"
        options={countries}
        value={formData.country || ''}
        onChange={handleCountryChange}
        onBlur={() => onBlur('country')}
        error={touched.country ? errors.country : undefined}
        required
        className="mb-4"
      />

      {formData.country === 'UK' && (
        <SelectField
          label="State"
          name="state"
          options={states}
          value={formData.state || ''}
          onChange={onInputChange}
          onBlur={() => onBlur('state')}
          error={touched.state ? errors.state : undefined}
          required
          className="mb-4"
        />
      )}

      {showCity && (
        <SelectField
          label="City"
          name="city"
          options={cities}
          value={formData.city || ''}
          onChange={handleCityChange}
          onBlur={() => onBlur('city')}
          error={touched.city ? errors.city : undefined}
          required
          className="mb-4"
        />
      )}
    </div>
  );
};

export default Location;

