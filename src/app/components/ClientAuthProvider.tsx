'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { AuthState } from '../utils/serverAuth';

interface ClientAuthProviderProps {
  children: ReactNode;
  initialAuthState?: AuthState;
}

export default function ClientAuthProvider({ children, initialAuthState }: ClientAuthProviderProps) {
  return (
    <AuthProvider initialAuthState={initialAuthState}>
      {children}
    </AuthProvider>
  );
}