'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isDesktop as isDesktopUtil, addResizeListener } from '../../utils/deviceUtils';

interface DesktopNewTabLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function DesktopNewTabLink({ href, children, className }: DesktopNewTabLinkProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(isDesktopUtil());
    check();
    const cleanup = addResizeListener(check);
    return cleanup;
  }, []);

  return (
    <Link
      href={href}
      className={className}
      target={isDesktop ? '_blank' : undefined}
      rel={isDesktop ? 'noopener noreferrer' : undefined}
    >
      {children}
    </Link>
  );
}


