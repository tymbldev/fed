'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { SearchFormData } from '../components/search/types';

interface SearchModalContextType {
  isSearchModalOpen: boolean;
  openSearchModal: (initialValues?: SearchFormData) => void;
  closeSearchModal: () => void;
  searchModalInitialValues: SearchFormData | undefined;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(undefined);

export function SearchModalProvider({ children }: { children: ReactNode }) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchModalInitialValues, setSearchModalInitialValues] = useState<SearchFormData | undefined>(undefined);

  const openSearchModal = (initialValues?: SearchFormData) => {
    setSearchModalInitialValues(initialValues);
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchModalInitialValues(undefined);
  };

  return (
    <SearchModalContext.Provider
      value={{
        isSearchModalOpen,
        openSearchModal,
        closeSearchModal,
        searchModalInitialValues,
      }}
    >
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const context = useContext(SearchModalContext);
  if (context === undefined) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
}