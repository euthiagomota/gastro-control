import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavigationProgress from './NavigationProgress';

export default function AppShell() {
  const navigation = useNavigation();
  const location = useLocation();
  const [tempLoading, setTempLoading] = useState(false);

  useEffect(() => {
    if (!location.pathname) return;

    setTempLoading(true);
    const timeoutId = window.setTimeout(() => setTempLoading(false), 200);
    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  const isLoading = navigation.state !== 'idle' || tempLoading;

  return (
    <div className="relative min-h-screen bg-[#F4F5F3]">
      <NavigationProgress isLoading={isLoading} />
      <Outlet />
    </div>
  );
}
