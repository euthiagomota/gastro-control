import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Bell, LogOut,
  TrendingUp, BookOpen, FileText,
  Calculator, Package, ChefHat, ChevronRight, CircleHelp, Sparkles
} from 'lucide-react';
import useOnboarding from '../../shared/context/useOnboarding';
import { demandaSteps } from '../../features/onboarding/constants/demandaSteps';
import { fichaMainSteps } from '../../features/onboarding/constants/fichaSteps';
import { calculoSteps } from '../../features/onboarding/constants/calculoSteps';
import { estoqueSteps } from '../../features/onboarding/constants/estoqueSteps';
import { producaoSteps } from '../../features/onboarding/constants/producaoSteps';
import { toursByRoute } from '../../features/onboarding/constants/tourSteps';

const sidebarItems = [
  { label: 'Demanda', path: '/admin/demanda', icon: TrendingUp },
  { label: 'Cardápio', path: '/admin/cardapio', icon: BookOpen },
  { label: 'Fichas Técnicas', path: '/admin/fichas-tecnicas', icon: FileText },
  { label: 'Cálculo', path: '/admin/calculo', icon: Calculator },
  { label: 'Estoque', path: '/admin/estoque', icon: Package },
  { label: 'Produção', path: '/admin/producao', icon: ChefHat },
  { label: 'Guia', path: '/admin/guia', icon: CircleHelp },
];

const adminName = 'Sara Almeida';
const adminInitials = 'SA';
const unidadeAtiva = 'Restaurante Boa Mesa';
const notificacoes = 4;

const pageContext = {
  '/admin/demanda': {
    title: 'Voce esta em Demanda',
    detail: 'Defina quantos pratos serao produzidos. Depois siga para Fichas Tecnicas.',
  },
  '/admin/cardapio': {
    title: 'Voce esta em Cardapio',
    detail: 'Revise quais pratos estao ativos no periodo.',
  },
  '/admin/fichas-tecnicas': {
    title: 'Voce esta em Fichas Tecnicas',
    detail: 'Defina ingredientes e quantidade por porcao. Isso alimenta o Calculo.',
  },
  '/admin/calculo': {
    title: 'Voce esta em Calculo',
    detail: 'Converta Demanda + Fichas Tecnicas em necessidade de ingredientes.',
  },
  '/admin/estoque': {
    title: 'Voce esta em Estoque',
    detail: 'Compare necessario x disponivel e ajuste faltas antes da Producao.',
  },
  '/admin/producao': {
    title: 'Voce esta em Producao',
    detail: 'Execute o plano com base no Calculo e no Estoque.',
  },
  '/admin/guia': {
    title: 'Voce esta no Guia',
    detail: 'Consulte explicacoes detalhadas e reinicie o tutorial quando precisar.',
  },
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { startTour, resumeTour, canResumeTour } = useOnboarding();
  const currentContext = pageContext[location.pathname];

  const isActive = (path) => location.pathname === path;

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const getTourForCurrentRoute = () => {
    const routeConfig = toursByRoute[location.pathname];
    
    if (!routeConfig) {
      return null;
    }

    const stepsMap = {
      'demanda-main': demandaSteps,
      'ficha-main': fichaMainSteps,
      'calculo-main': calculoSteps,
      'estoque-main': estoqueSteps,
      'producao-main': producaoSteps,
    };

    return {
      tourId: routeConfig.tourId,
      steps: stepsMap[routeConfig.tourId],
      pageTitle: routeConfig.pageTitle,
    };
  };

  const handleTutorialClick = () => {
    const tourInfo = getTourForCurrentRoute();
    
    if (!tourInfo) {
      return;
    }

    const canResume = canResumeTour(tourInfo.tourId);
    if (canResume) {
      resumeTour(tourInfo.tourId, tourInfo.steps);
    } else {
      startTour(tourInfo.tourId, tourInfo.steps, { force: true, startFrom: 'start' });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F3] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[86vw] max-w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out shadow-xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
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
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
                  active
                    ? 'bg-primary-700 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="truncate">{item.label}</span>
                <ChevronRight size={14} className={`ml-auto ${active ? 'text-primary-100' : 'text-gray-400'}`} />
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
        <header className="h-14 bg-[#F4F5F3] border-b border-gray-200/70 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-30">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:block">
            <span className="text-sm font-semibold text-gray-500 capitalize">
              {sidebarItems.find(i => isActive(i.path))?.label ?? 'Painel Admin'}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleTutorialClick}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-colors border border-gray-200"
              aria-label="Iniciar tutorial guiado"
              title="Clique para iniciar ou retomar o tutorial"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline text-sm font-medium">Tutorial</span>
            </button>

            <button
              onClick={() => navigate('/admin/guia')}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-colors border border-gray-200"
              aria-label="Abrir guia do usuario"
              data-tour="help-guide-button"
            >
              <CircleHelp size={16} />
              <span className="hidden sm:inline text-sm font-medium">Guia</span>
            </button>

            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-colors border border-gray-200" aria-label="Notificações">
              <Bell size={18} />
              {notificacoes > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificacoes}
                </span>
              )}
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-200">
              <div className="w-7 h-7 bg-amber-400 text-white rounded-lg flex items-center justify-center font-bold text-[11px]">
                {adminInitials}
              </div>
              <span className="text-sm font-medium hidden sm:block">{adminName}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 max-w-7xl mx-auto w-full">
            {currentContext && (
              <div className="mb-4 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">{currentContext.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{currentContext.detail}</p>
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
