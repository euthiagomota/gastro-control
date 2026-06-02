import { useContext } from 'react';
import OnboardingContext from './OnboardingContextValue';

export default function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }

  return context;
}
