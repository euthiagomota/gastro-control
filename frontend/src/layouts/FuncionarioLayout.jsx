import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Bell, LogOut,
  Home, ChefHat, CheckSquare, Package, ShoppingCart, AlertTriangle, User
} from 'lucide-react';

const sidebarItems = [
  { label: 'Início', path: '/funcionario/inicio', icon: Home },
  { label: 'Produção do Dia', path: '/funcionario/producao', icon: ChefHat },
  { label: 'Tarefas', path: '/funcionario/tarefas', icon: CheckSquare },
  { label: 'Estoque', path: '/funcionario/estoque', icon: Package },
  { label: 'Pedidos', path: '/funcionario/pedidos', icon: ShoppingCart },
  { label: 'Ocorrências', path: '/funcionario/ocorrencias', icon: AlertTriangle },
  { label: 'Perfil', path: '/funcionario/perfil', icon: User },
];

const funcionarioName = 'João Silva';
const funcionarioRole = 'Cozinheiro';
const funcionarioInitials = 'JS';
const unidade = 'Boa Mesa';
const notificacoes = 3;
const turnoAtivo = '08:00 — 17:00';

export default function FuncionarioLayout() {
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

        {/* Logo & User */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-primary-700 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
              GC
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">GastroControl</p>
              <p className="text-[11px] text-gray-500">Área do Funcionário</p>
            </div>
          </div>

          {/* User card */}
          <div className="flex items-center gap-3 bg-primary-50 rounded-xl px-3 py-2.5">
            <div className="w-9 h-9 bg-primary-700 text-white rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">
              {funcionarioInitials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-xs truncate">{funcionarioName}</p>
              <p className="text-[11px] text-gray-500 truncate">{funcionarioRole} · {unidade}</p>
            </div>
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

        {/* Logout */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span>Sair da conta</span>
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

          {/* Turno ativo */}
          <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
            <span className="text-sm">⏰</span>
            <span className="text-xs font-semibold text-green-700">
              Turno: <span className="font-bold">{turnoAtivo}</span>
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notificações">
              <Bell size={18} />
              {notificacoes > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificacoes}
                </span>
              )}
            </button>

            <div className="w-8 h-8 bg-primary-700 text-white rounded-lg flex items-center justify-center font-bold text-[11px]">
              {funcionarioInitials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full">
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
