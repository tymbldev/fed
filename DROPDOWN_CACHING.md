# Dropdown Caching System

This document describes the IndexedDB-based caching system implemented for dropdown options to reduce API calls and improve performance.

## Overview

The dropdown caching system stores dropdown options in the browser's IndexedDB and automatically refreshes them once per day (24 hours). This significantly reduces the number of API calls and improves the user experience by providing faster loading times for dropdown data.

## Features

- **Automatic Caching**: Dropdown options are automatically cached when first fetched
- **Daily Expiration**: Cached data expires after 24 hours and is automatically refreshed
- **Server-Side Rendering Support**: Falls back to direct API calls during SSR
- **Error Handling**: Graceful fallback if caching fails
- **Development Tools**: Cache management UI available in development mode

## Implementation

### Core Files

1. **`src/app/services/indexedDB.ts`** - IndexedDB service for data storage
2. **`src/app/services/api.ts`** - Updated `fetchDropdownOptions` function with caching
3. **`src/app/hooks/useDropdownOptions.ts`** - React hook for easy integration
4. **`src/app/components/CacheManager.tsx`** - Development cache management UI

### How It Works

1. **First Request**: When a dropdown is first accessed, data is fetched from the API and stored in IndexedDB
2. **Subsequent Requests**: Data is retrieved from IndexedDB cache
3. **Expiration Check**: On each request, the system checks if cached data is older than 24 hours
4. **Automatic Refresh**: Expired data is automatically deleted and fresh data is fetched

### Usage

#### Using the Hook (Recommended)

```tsx
import { useDropdownOptions } from '../hooks/useDropdownOptions';

const MyComponent = () => {
  const { options, isLoading, error, refresh } = useDropdownOptions('departments');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <select>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
```

#### Direct API Usage

```tsx
import { fetchDropdownOptions } from '../services/api';

const loadData = async () => {
  try {
    const options = await fetchDropdownOptions('departments');
    // options will be cached automatically
  } catch (error) {
    console.error('Failed to load options:', error);
  }
};
```

## Cache Management

### Utility Functions

```tsx
import {
  clearDropdownCache,
  refreshDropdownCache,
  getDropdownCacheInfo
} from '../services/api';

// Clear cache for specific type
await clearDropdownCache('departments');

// Clear all cache
await clearDropdownCache();

// Refresh cache for specific type
await refreshDropdownCache('departments');

// Get cache information
const cacheInfo = await getDropdownCacheInfo();
```

### Development Cache Manager

In development mode, a cache management UI is available in the bottom-right corner of the screen. This allows you to:

- View all cached dropdown types and their timestamps
- Clear individual cache entries
- Refresh individual cache entries
- Clear all cache data

## Supported Dropdown Types

The caching system works with all dropdown types that use the `fetchDropdownOptions` function:

- `departments`
- `designations`
- `companies`
- `skills`
- `locations`
- `currencies`
- `roles`
- And any other types that use the dropdowns endpoint

## Benefits

1. **Reduced API Calls**: Significantly fewer requests to the server
2. **Faster Loading**: Cached data loads instantly
3. **Better UX**: No loading delays for frequently accessed dropdowns
4. **Offline Support**: Cached data is available even when offline
5. **Automatic Management**: No manual cache invalidation needed

## Technical Details

### IndexedDB Schema

- **Database Name**: `FedAppDB`
- **Store Name**: `dropdownOptions`
- **Key Path**: `type` (dropdown type)
- **Index**: `timestamp` for expiration tracking

### Cache Duration

- **Default**: 24 hours (86,400,000 milliseconds)
- **Configurable**: Modify `CACHE_DURATION` in `indexedDB.ts`

### Error Handling

- If IndexedDB is not available, falls back to direct API calls
- If caching fails, data is still returned (caching errors don't break functionality)
- Server-side rendering always uses direct API calls

## Migration Guide

### For Existing Components

1. Replace direct `fetchDropdownOptions` calls with the `useDropdownOptions` hook
2. Remove manual loading states and error handling (handled by the hook)
3. Update option mapping if needed (hook returns `{ value, label }` format)

### Example Migration

**Before:**
```tsx
const [options, setOptions] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadOptions = async () => {
    try {
      const data = await fetchDropdownOptions('departments');
      setOptions(data);
    } catch (error) {
      console.error('Failed to load departments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  loadOptions();
}, []);
```

**After:**
```tsx
const { options, isLoading } = useDropdownOptions('departments');
```

## Browser Support

The caching system requires IndexedDB support, which is available in all modern browsers:

- Chrome 23+
- Firefox 16+
- Safari 10+
- Edge 12+

For older browsers, the system gracefully falls back to direct API calls.

## Performance Impact

- **Initial Load**: Slight delay due to IndexedDB initialization
- **Subsequent Loads**: Instant loading from cache
- **Memory Usage**: Minimal (only stores dropdown data)
- **Storage**: Uses browser's IndexedDB storage (typically 50MB+ available)