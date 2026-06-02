import { useCallback, useMemo, useState } from 'react';
import OnboardingContext from './OnboardingContextValue';

const ONBOARDING_STORAGE_KEY = 'gastrocontrol:onboarding:v2';

function getStoredState() {
  if (typeof window === 'undefined') {
    return {
      completedTours: {},
      progressByTour: {},
    };
  }

  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) {
      return {
        completedTours: {},
        progressByTour: {},
      };
    }

    const parsed = JSON.parse(raw);
    return {
      completedTours: parsed.completedTours ?? {},
      progressByTour: parsed.progressByTour ?? {},
    };
  } catch {
    return {
      completedTours: {},
      progressByTour: {},
    };
  }
}

function setStoredState(state) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
}

export function OnboardingProvider({ children }) {
  const persistedState = getStoredState();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentTourId, setCurrentTourId] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedTours, setCompletedTours] = useState(persistedState.completedTours);
  const [progressByTour, setProgressByTour] = useState(persistedState.progressByTour);

  const persistState = useCallback((nextCompletedTours, nextProgressByTour) => {
    setStoredState({
      completedTours: nextCompletedTours,
      progressByTour: nextProgressByTour,
    });
  }, []);

  const updateProgress = useCallback((tourId, index) => {
    if (!tourId) return;

    setProgressByTour((previous) => {
      const next = {
        ...previous,
        [tourId]: index,
      };
      persistState(completedTours, next);
      return next;
    });
  }, [completedTours, persistState]);

  const closeTour = useCallback(() => {
    if (currentTourId) {
      updateProgress(currentTourId, currentStepIndex);
    }
    setIsTourOpen(false);
  }, [currentStepIndex, currentTourId, updateProgress]);

  const completeTour = useCallback(() => {
    if (!currentTourId) {
      setIsTourOpen(false);
      return;
    }

    setCompletedTours((previousCompleted) => {
      const nextCompleted = {
        ...previousCompleted,
        [currentTourId]: true,
      };

      setProgressByTour((previousProgress) => {
        const nextProgress = {
          ...previousProgress,
          [currentTourId]: 0,
        };
        persistState(nextCompleted, nextProgress);
        return nextProgress;
      });

      return nextCompleted;
    });

    setIsTourOpen(false);
    setCurrentStepIndex(0);
  }, [currentTourId, persistState]);

  const startTour = useCallback((tourId, tourSteps, options = {}) => {
    const { force = false, startFrom = 'saved', startAtIndex } = options;

    if (!tourId || !tourSteps?.length) return false;
    if (completedTours[tourId] && !force) return false;

    const savedIndex = progressByTour[tourId] ?? 0;
    const maxIndex = Math.max(tourSteps.length - 1, 0);
    const indexToStart = typeof startAtIndex === 'number'
      ? Math.min(Math.max(startAtIndex, 0), maxIndex)
      : (startFrom === 'saved' ? Math.min(savedIndex, maxIndex) : 0);

    setCurrentTourId(tourId);
    setSteps(tourSteps);
    setCurrentStepIndex(indexToStart);
    setIsTourOpen(true);

    return true;
  }, [completedTours, progressByTour]);

  const startTourIfNeeded = useCallback((tourId, tourSteps, sessionKey = 'default') => {
    if (!tourId || !tourSteps?.length || completedTours[tourId] || isTourOpen || typeof window === 'undefined') return false;

    const autoStartKey = `gastrocontrol:onboarding:autostart:${sessionKey}`;
    if (window.sessionStorage.getItem(autoStartKey)) return false;

    window.sessionStorage.setItem(autoStartKey, 'true');
    const savedIndex = progressByTour[tourId] ?? 0;

    setCurrentTourId(tourId);
    setSteps(tourSteps);
    setCurrentStepIndex(Math.min(savedIndex, Math.max(tourSteps.length - 1, 0)));
    setIsTourOpen(true);

    return true;
  }, [completedTours, isTourOpen, progressByTour]);

  const resumeTour = useCallback((tourId, tourSteps) => {
    if (!tourId || !tourSteps?.length || completedTours[tourId]) return false;
    const savedIndex = progressByTour[tourId];
    if (typeof savedIndex !== 'number') return false;

    setCurrentTourId(tourId);
    setSteps(tourSteps);
    setCurrentStepIndex(Math.min(savedIndex, Math.max(tourSteps.length - 1, 0)));
    setIsTourOpen(true);
    return true;
  }, [completedTours, progressByTour]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((previous) => {
      if (previous >= steps.length - 1) {
        completeTour();
        return previous;
      }

      const next = previous + 1;
      updateProgress(currentTourId, next);
      return next;
    });
  }, [completeTour, currentTourId, steps.length, updateProgress]);

  const previousStep = useCallback(() => {
    setCurrentStepIndex((previous) => {
      const next = Math.max(0, previous - 1);
      updateProgress(currentTourId, next);
      return next;
    });
  }, [currentTourId, updateProgress]);

  const resetTour = useCallback((tourId) => {
    if (!tourId) return;

    setCompletedTours((previousCompleted) => {
      const nextCompleted = { ...previousCompleted };
      delete nextCompleted[tourId];

      setProgressByTour((previousProgress) => {
        const nextProgress = { ...previousProgress };
        delete nextProgress[tourId];
        persistState(nextCompleted, nextProgress);
        return nextProgress;
      });

      return nextCompleted;
    });
  }, [persistState]);

  const resetOnboarding = useCallback(() => {
    setCompletedTours({});
    setProgressByTour({});
    persistState({}, {});
  }, [persistState]);

  const canResumeTour = useCallback((tourId) => {
    if (!tourId) return false;
    return typeof progressByTour[tourId] === 'number' && !completedTours[tourId];
  }, [completedTours, progressByTour]);

  const value = useMemo(() => ({
    isTourOpen,
    currentTourId,
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex] ?? null,
    completedTours,
    progressByTour,
    startTour,
    startTourIfNeeded,
    resumeTour,
    nextStep,
    previousStep,
    closeTour,
    completeTour,
    resetTour,
    resetOnboarding,
    canResumeTour,
  }), [
    isTourOpen,
    currentTourId,
    steps,
    currentStepIndex,
    completedTours,
    progressByTour,
    startTour,
    startTourIfNeeded,
    resumeTour,
    nextStep,
    previousStep,
    closeTour,
    completeTour,
    resetTour,
    resetOnboarding,
    canResumeTour,
  ]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
