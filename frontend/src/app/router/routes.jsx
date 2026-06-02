import RootLayout from '../layouts/RootLayout';
import AdminLayout from '../layouts/AdminLayout';
import WelcomePage from '../../features/onboarding/pages/WelcomePage';
import GuiaPage from '../../features/onboarding/pages/GuiaPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import UnidadesPage from '../../features/onboarding/pages/UnidadesPage';
import DemandaPage from '../../features/mvp-flow/pages/DemandaPage';
import CardapioPage from '../../features/mvp-flow/pages/CardapioPage';
import FichaTecnicaPage from '../../features/mvp-flow/pages/FichaTecnicaPage';
import CalculoPage from '../../features/mvp-flow/pages/CalculoPage';
import EstoquePage from '../../features/mvp-flow/pages/EstoquePage';
import ProducaoPage from '../../features/mvp-flow/pages/ProducaoPage';

const routes = [
  // Public Routes
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <WelcomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/unidades',
        element: <UnidadesPage />,
      },
    ],
  },

  // Admin Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'demanda',
        element: <DemandaPage />,
      },
      {
        path: 'cardapio',
        element: <CardapioPage />,
      },
      {
        path: 'fichas-tecnicas',
        element: <FichaTecnicaPage />,
      },
      {
        path: 'calculo',
        element: <CalculoPage />,
      },
      {
        path: 'estoque',
        element: <EstoquePage />,
      },
      {
        path: 'producao',
        element: <ProducaoPage />,
      },
      {
        path: 'guia',
        element: <GuiaPage />,
      },
    ],
  },
];

export default routes;
