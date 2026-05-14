import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, TrendingUp, TrendingDown, Lightbulb, Package, BarChart3, Users, Settings } from 'lucide-react';
import Card from '../components/Card';

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
  const adminName = 'Sara';
  const date = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const [selectedPeriod, setSelectedPeriod] = useState('hoje');

  const kpis = [
    { label: 'Pratos vendidos', value: '142', trend: '+8%', trendDir: 'up', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: '🍽️' },
    { label: 'Receita do dia', value: 'R$ 856', trend: '+5%', trendDir: 'up', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: '💰' },
    { label: 'Pedidos em preparo', value: '8', trend: '18 min', trendDir: 'neutral', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: '⏳' },
    { label: 'Estoque crítico', value: '4 itens', trend: 'atenção', trendDir: 'down', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: '📦' },
  ];

  const alerts = [
    { id: 1, type: 'error', message: 'Estoque baixo: frango (2,5kg), arroz (8kg) e queijo (1,2kg)' },
    { id: 2, type: 'warning', message: 'Produção recomendada: 42 unidades de marmita fitness' },
    { id: 3, type: 'info', message: 'Demanda em alta: Açaí Gourmet com +7 unidades acima do previsto' },
    { id: 4, type: 'warning', message: 'Produto próximo do vencimento: Queijo mussarela (Vence em 2026-05-10)' },
  ];

  const recommendations = [
    { id: 1, title: 'Aumentar produção de Açaí', description: 'Demanda 20% acima do previsto esta semana', action: 'Ver detalhes', link: '/admin/demanda' },
    { id: 2, title: 'Comprar ingredientes urgentes', description: 'Estoque crítico de 3 itens principais', action: 'Fazer pedido', link: '/admin/estoque' },
    { id: 3, title: 'Revisar cardápio', description: 'Itens com baixa demanda podem ser revistos', action: 'Analisar', link: '/admin/cardapio' },
  ];

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
                  <h2 className="text-base font-bold text-gray-900">Alertas do dia</h2>
                  <p className="text-xs text-gray-500">{alerts.length} alertas ativos</p>
                </div>
              </div>
              <span className="text-xl font-bold text-red-500 bg-red-50 rounded-full w-8 h-8 flex items-center justify-center text-sm">
                {alerts.length}
              </span>
            </div>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <AlertBadge key={alert.id} type={alert.type} message={alert.message} />
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-amber-500" />
              <h2 className="text-base font-bold text-gray-900">Recomendações</h2>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer group"
                  onClick={() => navigate(rec.link)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{rec.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{rec.description}</p>
                    </div>
                    <span className="text-primary-700 text-xs font-semibold whitespace-nowrap group-hover:underline">
                      {rec.action} →
                    </span>
                  </div>
                </div>
              ))}
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
              {[
                { label: 'Eficiência de produção', value: '94%' },
                { label: 'Taxa de desperdício', value: '3.2%' },
                { label: 'Satisfação da equipe', value: '4.8/5' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs opacity-75">{stat.label}</span>
                  <span className="text-sm font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
