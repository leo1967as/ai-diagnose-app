import { useState } from 'react';

export type ViewState = 'form' | 'loading' | 'result' | 'error' | 'analysis';

export const useViewState = () => {
  const [currentView, setCurrentView] = useState<ViewState>('form');
  return { currentView, setCurrentView };
};

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  return { isLoading, setIsLoading };
};