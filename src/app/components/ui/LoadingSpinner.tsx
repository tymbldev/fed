import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Background shadow for depth */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 60%)',
          transform: 'translateY(2px)',
          filter: 'blur(2px)'
        }}
      />
      {/* Main spinner ring */}
      <div
        className="absolute inset-0 rounded-full before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(rgba(255,255,255,0.4),transparent_60%)] after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-[linear-gradient(transparent_40%,rgba(0,0,0,0.3))]"
        style={{
          background: 'conic-gradient(from 180deg, #10b981, #059669, #0d9488, #10b981)',
          maskImage: 'radial-gradient(transparent 40%, black 41%)',
          WebkitMaskImage: 'radial-gradient(transparent 40%, black 41%)',
          animation: 'spin 1s linear infinite',
          filter: 'brightness(1.2) contrast(1.1)',
          boxShadow: `
            inset 0 0 20px rgba(0,0,0,0.4),
            inset 0 0 8px rgba(255,255,255,0.2),
            0 0 12px rgba(0,0,0,0.2),
            0 0 4px rgba(0,0,0,0.1)
          `
        }}
      />
      {/* Highlight overlay */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          maskImage: 'radial-gradient(transparent 40%, black 41%)',
          WebkitMaskImage: 'radial-gradient(transparent 40%, black 41%)',
        }}
      />
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}