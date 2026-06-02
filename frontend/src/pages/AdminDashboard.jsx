import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, TrendingUp, TrendingDown, Lightbulb, Package, BarChart3, Users, Settings, Loader } from 'lucide-react';
import Card from '../components/Card';
import { dashboardService } from '../shared/services/dashboardService';
import { estoqueService } from '../shared/services/estoqueService';
import { usuarioService } from '../shared/services/usuarioService';

function AlertBadge({ type, message }) {
  const styles = {
    error: { bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500', text: 'text-red-700', icon: '🔴' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', text: 'text-amber-700', icon: '🟡' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700', icon: '🔵' },
  };
  const s = styles[type] || styles.info;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${s.bg} ${s.border}`}>
      <span className="text-sm flex-shrink-0">{s.icon}</span>
      <p className={`text-sm ${s.text}`}>{message}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const date = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const [selectedPeriod, setSelectedPeriod] = useState('hoje');
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');
  const [dashboardData, setDashboardData] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Carregar dados do usuário logado
        const user = await usuarioService.getCurrentUser();
        setAdminName(user.nome || 'Admin');
        
        // Carregar dashboard data
        const dashboard = await dashboardService.getDashboard();
        setDashboardData(dashboard);
        
        // Carregar alertas do estoque
        const alertasBaixo = await estoqueService.getAlertasEstoqueBaixo();
        const alertasVencimento = await estoqueService.getAlertasVencimento();
        
        const alertasFormatados = [];
        
        // Adicionar alertas de estoque baixo
        if (alertasBaixo && alertasBaixo.length > 0) {
          alertasFormatados.push({
            id: 'estoque-baixo',
            type: 'error',
            message: `Estoque baixo: ${alertasBaixo.map(a => `${a.ingrediente} (${a.quantidadeDisponivel}${a.unidadeMedida})`).join(', ')}`,
          });
        }
        
        // Adicionar alertas de vencimento
        if (alertasVencimento && alertasVencimento.length > 0) {
          alertasVencimento.forEach((alerta, idx) => {
            alertasFormatados.push({
              id: `vencimento-${idx}`,
              type: 'warning',
              message: `Produto próximo do vencimento: ${alerta.ingrediente} (Vence em ${new Date(alerta.dataVencimento).toLocaleDateString('pt-BR')})`,
            });
          });
        }
        
        // Se não houver alertas, mostrar mensagem informativa
        if (alertasFormatados.length === 0) {
          alertasFormatados.push({
            id: 'ok',
            type: 'info',
            message: '✓ Estoque em situação normal, sem alertas críticos',
          });
        }
        
        setAlertas(alertasFormatados);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Erro ao carregar dados do dashboard');
        setAlertas([{
          id: 'error',
          type: 'error',
          message: 'Erro ao carregar alertas. Verifique sua conexão.',
        }]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const kpis = dashboardData ? [
    { label: 'Pratos vendidos', value: dashboardData.pratosSemana || '0', trend: dashboardData.trendPratos || '0%', trendDir: dashboardData.trendPratosDirecao || 'neutral', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: '🍽️' },
    { label: 'Receita do período', value: `R$ ${(dashboardData.receitaSemana || 0).toLocaleString('pt-BR')}`, trend: dashboardData.trendReceita || '0%', trendDir: dashboardData.trendReceitaDirecao || 'neutral', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: '💰' },
    { label: 'Demandas processadas', value: dashboardData.demandasProcessadas || '0', trend: dashboardData.trendDemandas || '0%', trendDir: dashboardData.trendDemandasDirecao || 'neutral', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: '⏳' },
    { label: 'Itens em estoque', value: dashboardData.itensEstoque || '0', trend: dashboardData.itensAlerta || '0', trendDir: dashboardData.itensAlerta > 0 ? 'down' : 'up', color: dashboardData.itensAlerta > 0 ? 'text-red-700' : 'text-green-700', bg: dashboardData.itensAlerta > 0 ? 'bg-red-50' : 'bg-green-50', border: dashboardData.itensAlerta > 0 ? 'border-red-200' : 'border-green-200', icon: '📦' },
  ] : [];

  const quickActions = [
    { label: 'Gerar relatório', icon: BarChart3, path: '/admin/relatorios' },
    { label: 'Adicionar demanda', icon: TrendingUp, path: '/admin/demanda' },
    { label: 'Funcionários', icon: Users, path: '/admin/funcionarios' },
    { label: 'Configurações', icon: Settings, path: '/admin/configuracoes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Olá, {adminName}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{date}</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1">
          {['hoje', 'semana', 'mês'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                selectedPeriod === period
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader className="animate-spin text-primary-700" size={32} />
            <p className="text-sm text-gray-500">Carregando dashboard...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {kpis.map((kpi, i) => (
              <Card key={i} className={`border ${kpi.border} ${kpi.bg} !p-4`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl">{kpi.icon}</span>
                  <span className={`text-xs font-semibold flex items-center gap-1 ${kpi.trendDir === 'up' ? 'text-green-600' : kpi.trendDir === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                    {kpi.trendDir === 'up' && <TrendingUp size={12} />}
                    {kpi.trendDir === 'down' && <TrendingDown size={12} />}
                    {kpi.trend}
                  </span>
                </div>
                <p className={`text-xl sm:text-2xl font-bold ${kpi.color} mb-0.5`}>{kpi.value}</p>
                <p className="text-xs text-gray-500 leading-snug">{kpi.label}</p>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left - Alerts + Recommendations */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Alerts Card */}
              <Card className="border-l-4 border-l-red-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Alertas</h2>
                      <p className="text-xs text-gray-500">{alertas.length} alertas</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-red-500 bg-red-50 rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {alertas.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {alertas.map((alert) => (
                    <AlertBadge key={alert.id} type={alert.type} message={alert.message} />
                  ))}
                </div>
              </Card>

              {/* Recommendations */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-amber-500" />
                  <h2 className="text-base font-bold text-gray-900">Ações recomendadas</h2>
                </div>
                <div className="space-y-3">
                  {dashboardData?.recomendacoes && dashboardData.recomendacoes.length > 0 ? (
                    dashboardData.recomendacoes.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer group"
                        onClick={() => navigate(rec.link || '#')}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm">{rec.titulo}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{rec.descricao}</p>
                          </div>
                          <span className="text-primary-700 text-xs font-semibold whitespace-nowrap group-hover:underline">
                            Ver →
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-sm text-green-700">✓ Tudo em dia! Nenhuma ação urgente.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right - Quick Actions */}
            <div className="space-y-4">
              <Card>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Ações rápidas</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {quickActions.map((action, i) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => navigate(action.path)}
                        className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-center group"
                      >
                        <div className="w-10 h-10 bg-gray-100 group-hover:bg-primary-100 rounded-xl flex items-center justify-center transition-colors">
                          <Icon size={20} className="text-gray-600 group-hover:text-primary-700 transition-colors" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-primary-700 leading-tight transition-colors">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Mini stats */}
              <Card className="bg-gradient-to-br from-primary-700 to-primary-800 border-0 text-white">
                <h3 className="text-sm font-bold mb-4 opacity-90">Resumo do período</h3>
                <div className="space-y-3">
                  {dashboardData ? [
                    { label: 'Eficiência de produção', value: `${dashboardData.eficiencia || 0}%` },
                    { label: 'Taxa de desperdício', value: `${dashboardData.desperdicio || 0}%` },
                    { label: 'Satisfação da equipe', value: dashboardData.satisfacao ? `${dashboardData.satisfacao}/5` : 'N/A' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs opacity-75">{stat.label}</span>
                      <span className="text-sm font-bold">{stat.value}</span>
                    </div>
                  )) : null}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
