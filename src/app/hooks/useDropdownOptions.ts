"use client";

import { useState, useEffect, useCallback } from 'react';
import { fetchDropdownOptions, refreshDropdownCache } from '../services/api';
import { toast } from 'sonner';

interface UseDropdownOptionsReturn {
  options: { value: string; label: string }[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useDropdownOptions = (type: string): UseDropdownOptionsReturn => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDropdownOptions(type);
      setOptions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load options';
      setError(errorMessage);
      toast.error(`Failed to load ${type}. Please try again.`);
      console.error(`Failed to fetch ${type}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await refreshDropdownCache(type);
      setOptions(data);
      toast.success(`${type} data refreshed successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh options';
      setError(errorMessage);
      toast.error(`Failed to refresh ${type}. Please try again.`);
      console.error(`Failed to refresh ${type}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  return {
    options,
    isLoading,
    error,
    refresh
  };
};