'use client';

import { useSearchModal } from '../../context/SearchModalContext';
import GlobalSearchModal from './GlobalSearchModal';

export default function GlobalSearchModalWrapper() {
  const { isSearchModalOpen, closeSearchModal, searchModalInitialValues } = useSearchModal();

  return (
    <GlobalSearchModal
      isOpen={isSearchModalOpen}
      onClose={closeSearchModal}
      initialValues={searchModalInitialValues}
    />
  );
}


