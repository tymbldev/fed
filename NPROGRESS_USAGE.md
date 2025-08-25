# NProgress Implementation Guide

## Overview

This implementation provides a modern, animated progress bar that shows during navigation and can be triggered immediately on link clicks. It uses NProgress with custom styling and enhanced functionality.

## Features

- ✅ **Automatic Detection**: Shows during route changes
- ✅ **Immediate Trigger**: Starts on link clicks before navigation
- ✅ **Smart Detection**: Skips progress when opening links in new tabs (Ctrl/Cmd + Click)
- ✅ **Manual Control**: Programmatic API for custom scenarios
- ✅ **Dark Mode Support**: Adapts to theme changes
- ✅ **Smooth Animations**: Beautiful gradient animations
- ✅ **Multiple Trigger Methods**: Various ways to enable progress

## Quick Start

### 1. Automatic Progress (Default)

The progress bar automatically shows during navigation - no additional code needed!

### 2. Immediate Progress on Link Clicks

The progress bar starts immediately when users click on links, providing instant visual feedback.

**Note**: The progress bar is smart and won't start when users hold **Ctrl** (Windows/Linux) or **Cmd** (Mac) to open links in new tabs, as this doesn't trigger a navigation event.

#### Option 1: Use ProgressLink Component (Recommended)

```tsx
import ProgressLink from '@/app/components/ProgressLink';

// Simple usage
<ProgressLink href="/about-us" className="btn btn-primary">
  About Us
</ProgressLink>

// With custom onClick
<ProgressLink
  href="/contact"
  className="btn btn-secondary"
  onClick={() => console.log('Link clicked!')}
>
  Contact Us
</ProgressLink>
```

#### Option 2: Add CSS Class

```tsx
import Link from 'next/link';

<Link
  href="/faqs"
  className="btn btn-primary nprogress-trigger"
>
  FAQs
</Link>
```

#### Option 3: Use Data Attribute

```tsx
import Link from 'next/link';

<Link
  href="/privacy"
  className="btn btn-outline"
  data-nprogress="true"
>
  Privacy Policy
</Link>
```

#### Option 4: Use Alternative Class

```tsx
import Link from 'next/link';

<Link
  href="/terms"
  className="btn btn-secondary show-progress"
>
  Terms & Conditions
</Link>
```

## Manual Control

### Basic API

```tsx
import NProgress from 'nprogress';

// Start progress
NProgress.start();

// Set specific progress (0-1)
NProgress.set(0.5);

// Complete progress
NProgress.done();

// Remove progress bar
NProgress.remove();
```

### Using the Hook

```tsx
import { useNavigationLoader } from '@/app/hooks/useNavigationLoader';

function MyComponent() {
  const { startLoading, setProgress, completeLoading } = useNavigationLoader();

  const handleSubmit = async () => {
    startLoading();
    setProgress(0.2);

    try {
      await submitData();
      setProgress(0.8);
      setTimeout(() => completeLoading(), 200);
    } catch (error) {
      completeLoading();
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### Simulate Loading

```tsx
import { simulateLoading } from '@/app/hooks/useNavigationLoader';

// Simulate 3-second loading
simulateLoading(3000);
```

## Advanced Patterns

### API Calls with Progress

```tsx
const fetchData = async () => {
  NProgress.start();

  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    NProgress.done();
    return data;
  } catch (error) {
    NProgress.done();
    throw error;
  }
};
```

### Form Submissions

```tsx
const handleFormSubmit = async (formData: FormData) => {
  NProgress.start();
  NProgress.set(0.2);

  try {
    await submitForm(formData);
    NProgress.set(0.8);
    setTimeout(() => NProgress.done(), 200);
  } catch (error) {
    NProgress.done();
  }
};
```

### File Uploads

```tsx
const handleFileUpload = (file: File) => {
  NProgress.start();
  NProgress.set(0.1);

  const upload = new XMLHttpRequest();

  upload.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const progress = e.loaded / e.total;
      NProgress.set(progress);
    }
  });

  upload.addEventListener('load', () => {
    NProgress.done();
  });

  upload.addEventListener('error', () => {
    NProgress.done();
  });

  // Start upload...
};
```

## Customization

### Styling

The progress bar styling is defined in `src/app/globals.css`. You can customize:

- Colors and gradients
- Animation duration
- Height and position
- Dark mode appearance

### Configuration

Modify the NProgress configuration in `GlobalNavigationLoader.tsx`:

```tsx
NProgress.configure({
  showSpinner: false,        // Hide spinner
  minimum: 0.1,              // Minimum progress
  easing: 'ease',            // Animation easing
  speed: 800,                // Animation speed
  trickle: true,             // Enable trickle effect
  trickleSpeed: 200,         // Trickle speed
});
```

## Best Practices

### 1. Use ProgressLink for Navigation

```tsx
// ✅ Good - Immediate feedback
<ProgressLink href="/dashboard" className="nav-link">
  Dashboard
</ProgressLink>

// ❌ Avoid - No immediate feedback
<Link href="/dashboard" className="nav-link">
  Dashboard
</Link>
```

### 2. Handle Errors Gracefully

```tsx
const handleAsyncOperation = async () => {
  NProgress.start();

  try {
    await riskyOperation();
    NProgress.done();
  } catch (error) {
    NProgress.done(); // Always complete on error
    handleError(error);
  }
};
```

### 3. Set Realistic Progress

```tsx
// ✅ Good - Realistic progress
NProgress.set(0.3); // 30% complete

// ❌ Avoid - Jumping progress
NProgress.set(0.9); // 90% when just starting
```

### 4. Use for Long Operations

```tsx
// ✅ Good - Long API calls
const fetchLargeDataset = async () => {
  NProgress.start();
  const data = await api.getLargeDataset();
  NProgress.done();
  return data;
};

// ❌ Avoid - Quick operations
const toggleTheme = () => {
  NProgress.start(); // Too quick to be useful
  setTheme(prev => prev === 'light' ? 'dark' : 'light');
  NProgress.done();
};
```

## Troubleshooting

### Progress Bar Not Showing

1. Check if `GlobalNavigationLoader` is included in your layout
2. Verify NProgress is properly imported
3. Ensure CSS is loaded

### Progress Bar Stuck

```tsx
// Force complete if stuck
NProgress.done();
NProgress.remove();
```

### Multiple Progress Bars

The implementation prevents multiple progress bars from showing simultaneously.

## Examples

See `src/app/components/NavigationLoaderExample.tsx` for comprehensive examples of all features.

## Migration from Custom Loader

If you were using a custom loader before:

1. Replace custom loader components with NProgress
2. Update link classes to use `nprogress-trigger`
3. Replace manual state management with NProgress API
4. Remove custom CSS animations

The NProgress implementation provides better performance and more consistent behavior across browsers.
