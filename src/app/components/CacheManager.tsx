"use client";

import React, { useState, useEffect } from 'react';
import { clearDropdownCache, getDropdownCacheInfo, refreshDropdownCache } from '../services/api';

const CacheManager: React.FC = () => {
  const [cacheInfo, setCacheInfo] = useState<{ type: string; timestamp: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCacheInfo = async () => {
    try {
      const info = await getDropdownCacheInfo();
      setCacheInfo(info);
    } catch (error) {
      console.error('Failed to load cache info:', error);
    }
  };

  const handleClearAllCache = async () => {
    try {
      setIsLoading(true);
      await clearDropdownCache();
      await loadCacheInfo();
      alert('All cache cleared successfully!');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Failed to clear cache');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshCache = async (type: string) => {
    try {
      setIsLoading(true);
      await refreshDropdownCache(type);
      await loadCacheInfo();
      alert(`${type} cache refreshed successfully!`);
    } catch (error) {
      console.error(`Failed to refresh ${type} cache:`, error);
      alert(`Failed to refresh ${type} cache`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async (type: string) => {
    try {
      setIsLoading(true);
      await clearDropdownCache(type);
      await loadCacheInfo();
      alert(`${type} cache cleared successfully!`);
    } catch (error) {
      console.error(`Failed to clear ${type} cache:`, error);
      alert(`Failed to clear ${type} cache`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCacheInfo();
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50 hidden md:block">
      <h3 className="text-lg font-semibold mb-3">Dropdown Cache Manager</h3>

      <div className="space-y-2 mb-4">
        <button
          onClick={handleClearAllCache}
          disabled={isLoading}
          className="w-full bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
        >
          {isLoading ? 'Clearing...' : 'Clear All Cache'}
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Cached Data:</h4>
        {cacheInfo.length === 0 ? (
          <p className="text-gray-500 text-sm">No cached data</p>
        ) : (
          <div className="space-y-1">
            {cacheInfo.map((item) => (
              <div key={item.type} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{item.type}</span>
                  <span className="text-gray-500 ml-2">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="space-x-1">
                  <button
                    onClick={() => handleRefreshCache(item.type)}
                    disabled={isLoading}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => handleClearCache(item.type)}
                    disabled={isLoading}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CacheManager;