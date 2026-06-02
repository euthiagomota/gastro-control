import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './app/router/routes';
import { OnboardingProvider } from './shared/context/OnboardingContext';
import { OperationalFlowProvider } from './shared/context/OperationalFlowContext';
import OnboardingTour from './features/onboarding/components/OnboardingTour';

function App() {
  return (
    <OperationalFlowProvider>
      <OnboardingProvider>
        <RouterProvider router={createBrowserRouter(routes)} />
        <OnboardingTour />
      </OnboardingProvider>
    </OperationalFlowProvider>
  );
}

export default App;
