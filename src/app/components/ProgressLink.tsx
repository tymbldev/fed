'use client';

import Link from 'next/link';
import NProgress from 'nprogress';

interface ProgressLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: string | React.ReactNode | ((e: React.MouseEvent) => void) | undefined;
}

export default function ProgressLink({
  href,
  children,
  className = '',
  onClick,
  ...props
}: ProgressLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Check if Ctrl/Cmd key is pressed (opening in new tab)
    const isOpeningInNewTab = e.ctrlKey || e.metaKey;

    // Don't start progress if opening in new tab
    if (isOpeningInNewTab) {
      // Call original onClick if provided
      onClick?.(e);
      return;
    }

    // Start NProgress immediately
    NProgress.start();

    // Set initial progress after a short delay
    setTimeout(() => {
      NProgress.set(0.4);
    }, 100);

    // Call original onClick if provided
    onClick?.(e);
  };

  return (
    <Link
      href={href}
      className={`nprogress-trigger ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}

// Alternative: Higher-order component for existing links
export function withProgress<T extends { onClick?: (e: React.MouseEvent) => void; className?: string }>(
  Component: React.ComponentType<T>
) {
  return function ProgressWrappedComponent(props: T) {
    const handleClick = (e: React.MouseEvent) => {
      // Check if Ctrl/Cmd key is pressed (opening in new tab)
      const isOpeningInNewTab = e.ctrlKey || e.metaKey;

      // Don't start progress if opening in new tab
      if (isOpeningInNewTab) {
        props.onClick?.(e);
        return;
      }

      // Start NProgress immediately
      NProgress.start();

      // Set initial progress
      setTimeout(() => {
        NProgress.set(0.4);
      }, 100);

      // Call original onClick if provided
      props.onClick?.(e);
    };

    return (
      <Component
        {...props}
        onClick={handleClick}
        className={`nprogress-trigger ${props.className || ''}`}
      />
    );
  };
}
