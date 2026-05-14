import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Bell, LogOut,
  LayoutDashboard, TrendingUp, BookOpen, FileText,
  Package, ChefHat, ShoppingCart, Calendar,
  Users, BarChart3, Settings
} from 'lucide-react';

const sidebarItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Demanda', path: '/admin/demanda', icon: TrendingUp },
  { label: 'Cardápio', path: '/admin/cardapio', icon: BookOpen },
  { label: 'Fichas Técnicas', path: '/admin/fichas-tecnicas', icon: FileText },
  { label: 'Estoque', path: '/admin/estoque', icon: Package },
  { label: 'Produção', path: '/admin/producao', icon: ChefHat },
  { label: 'Compras', path: '/admin/compras', icon: ShoppingCart },
  { label: 'Reservas', path: '/admin/reservas', icon: Calendar },
  { label: 'Funcionários', path: '/admin/funcionarios', icon: Users },
  { label: 'Relatórios', path: '/admin/relatorios', icon: BarChart3 },
  { label: 'Configurações', path: '/admin/configuracoes', icon: Settings },
];

const adminName = 'Sara Almeida';
const adminInitials = 'SA';
const unidadeAtiva = 'Restaurante Boa Mesa';
const notificacoes = 4;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Close button mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-primary-700 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
              GC
            </div>
            <span className="font-bold text-gray-900 text-sm">GastroControl</span>
          </div>
          <div className="bg-primary-50 rounded-lg px-3 py-2">
            <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider mb-0.5">Unidade ativa</p>
            <p className="text-xs font-semibold text-gray-900 truncate">{unidadeAtiva}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 ${
                  active
                    ? 'bg-primary-700 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-9 h-9 bg-primary-700 text-white rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">
              {adminInitials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-semibold text-gray-900 text-xs truncate">{adminName}</p>
              <p className="text-[11px] text-gray-500">Administrador</p>
            </div>
            <LogOut size={16} className="text-gray-400 group-hover:text-red-500 flex-shrink-0 transition-colors" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-30">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>

          {/* Desktop: page title placeholder / breadcrumb */}
          <div className="hidden lg:block">
            <span className="text-sm font-semibold text-gray-500">
              {sidebarItems.find(i => isActive(i.path))?.label ?? 'Painel Admin'}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notificações">
              <Bell size={18} />
              {notificacoes > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificacoes}
                </span>
              )}
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-7 h-7 bg-primary-700 text-white rounded-lg flex items-center justify-center font-bold text-[11px]">
                {adminInitials}
              </div>
              <span className="text-sm font-medium hidden sm:block">{adminName.split(' ')[0]}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
