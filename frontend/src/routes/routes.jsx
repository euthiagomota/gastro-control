import RootLayout from '../layouts/RootLayout';
import AdminLayout from '../layouts/AdminLayout';
import FuncionarioLayout from '../layouts/FuncionarioLayout';
import WelcomePage from '../pages/WelcomePage';
import LoginPage from '../pages/LoginPage';
import UnidadesPage from '../pages/UnidadesPage';
import AdminDashboard from '../pages/AdminDashboard';
import AdminDemanda from '../pages/AdminDemanda';
import AdminEstoque from '../pages/AdminEstoque';
import AdminFuncionarios from '../pages/AdminFuncionarios';
import FuncionarioDashboard from '../pages/FuncionarioDashboard';
import FuncionarioProducao from '../pages/FuncionarioProducao';
import FuncionarioTarefas from '../pages/FuncionarioTarefas';
import FuncionarioPerfil from '../pages/FuncionarioPerfil';

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
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'demanda',
        element: <AdminDemanda />,
      },
      {
        path: 'cardapio',
        element: <div className="text-center py-12">Cardápio - Em desenvolvimento</div>,
      },
      {
        path: 'fichas-tecnicas',
        element: <div className="text-center py-12">Fichas Técnicas - Em desenvolvimento</div>,
      },
      {
        path: 'estoque',
        element: <AdminEstoque />,
      },
      {
        path: 'producao',
        element: <div className="text-center py-12">Produção - Em desenvolvimento</div>,
      },
      {
        path: 'compras',
        element: <div className="text-center py-12">Compras - Em desenvolvimento</div>,
      },
      {
        path: 'reservas',
        element: <div className="text-center py-12">Reservas - Em desenvolvimento</div>,
      },
      {
        path: 'funcionarios',
        element: <AdminFuncionarios />,
      },
      {
        path: 'relatorios',
        element: <div className="text-center py-12">Relatórios - Em desenvolvimento</div>,
      },
      {
        path: 'configuracoes',
        element: <div className="text-center py-12">Configurações - Em desenvolvimento</div>,
      },
    ],
  },

  // Funcionário Routes
  {
    path: '/funcionario',
    element: <FuncionarioLayout />,
    children: [
      {
        path: 'inicio',
        element: <FuncionarioDashboard />,
      },
      {
        path: 'producao',
        element: <FuncionarioProducao />,
      },
      {
        path: 'tarefas',
        element: <FuncionarioTarefas />,
      },
      {
        path: 'estoque',
        element: <div className="text-center py-12">Estoque - Em desenvolvimento</div>,
      },
      {
        path: 'pedidos',
        element: <div className="text-center py-12">Pedidos - Em desenvolvimento</div>,
      },
      {
        path: 'ocorrencias',
        element: <div className="text-center py-12">Ocorrências - Em desenvolvimento</div>,
      },
      {
        path: 'perfil',
        element: <FuncionarioPerfil />,
      },
    ],
  },
];

export default routes;
