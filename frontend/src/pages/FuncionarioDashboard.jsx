import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { usuarioService } from '../shared/services/usuarioService';
import { demandaService } from '../shared/services/demandaService';
import { estoqueService } from '../shared/services/estoqueService';

function AlertBadge({ type, message }) {
  const styles = {
    error: { bg: 'bg-red-50', border: 'border-red-200', icon: '🔴', text: 'text-red-700' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '🟡', text: 'text-amber-700' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '🔵', text: 'text-blue-700' },
  };
  const s = styles[type] || styles.info;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${s.bg} ${s.border}`}>
      <span className="text-sm flex-shrink-0">{s.icon}</span>
      <p className={`text-sm ${s.text} leading-snug`}>{message}</p>
    </div>
  );
}

export default function FuncionarioDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [demandas, setDemandas] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const user = await usuarioService.getCurrentUser();
      setUserData(user);

      const demandaList = await demandaService.listDemandas({ status: 'ATIVA' });
      setDemandas(demandaList || []);

      const alertasEstoque = await estoqueService.getAlertasEstoqueBaixo();
      setAlertas(alertasEstoque || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { label: 'Prod. pendentes', value: demandas.filter((d) => d.status !== 'FINALIZADO').length, icon: '📋', bg: 'bg-amber-50', border: 'border-amber-200', color: 'text-amber-700' },
    { label: 'Em andamento', value: demandas.filter((d) => d.status === 'EM_PRODUCAO').length, icon: '👨‍🍳', bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-700' },
    { label: 'Pedidos aguardando', value: demandas.filter((d) => d.status === 'AGUARDANDO').length, icon: '🛒', bg: 'bg-purple-50', border: 'border-purple-200', color: 'text-purple-700' },
    { label: 'Alertas de estoque', value: alertas.length, icon: '⚠️', bg: 'bg-red-50', border: 'border-red-200', color: 'text-red-700' },
  ];

  const priorityTasks = demandas.slice(0, 5).map((demanda) => ({
    id: demanda.id,
    title: `Preparar ${demanda.quantidadePrevista} ${demanda.prato}`,
    priority: demanda.prioridade || 'media',
    completed: demanda.status === 'FINALIZADO',
  }));

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-700';
      case 'media':
        return 'bg-amber-100 text-amber-700';
      case 'baixa':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Boa noite, {userData?.nome?.split(' ')[0] || 'Operador'}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{hoje}</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 self-start">
          <span className="text-lg">⏰</span>
          <div>
            <p className="text-[10px] font-semibold text-green-600 uppercase">Turno ativo</p>
            <p className="text-sm font-bold text-green-700">08:00 — 17:00</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className={`border ${metric.border} ${metric.bg} !p-4`}>
            <div className="text-xl mb-2">{metric.icon}</div>
            <div className={`text-xl sm:text-2xl font-bold ${metric.color} mb-0.5`}>{metric.value}</div>
            <p className="text-xs text-gray-500 leading-snug">{metric.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {alertas.length > 0 && (
            <Card className="border-l-4 border-l-red-500">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xl">⚠️</span>
                <h2 className="text-base font-bold text-gray-900">Alertas urgentes</h2>
              </div>
              <div className="space-y-2">
                {alertas.slice(0, 2).map((alerta, i) => (
                  <AlertBadge
                    key={i}
                    type="error"
                    message={`${alerta.ingrediente} em nível crítico — ${alerta.quantidade} ${alerta.unidade}`}
                  />
                ))}
              </div>
            </Card>
          )}

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Tarefas prioritárias</h2>
              <button
                onClick={() => navigate('/funcionario/tarefas')}
                className="text-sm text-primary-700 font-medium hover:underline"
              >
                Ver todas →
              </button>
            </div>
            <div className="space-y-2">
              {priorityTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-gray-50 border-gray-100 opacity-60'
                      : 'bg-white border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                      task.completed ? 'bg-green-500' : 'border-2 border-gray-300'
                    }`}
                  >
                    {task.completed && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <p
                    className={`flex-1 text-sm font-medium ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Ações rápidas</h3>
            <div className="space-y-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => navigate('/funcionario/producao')}
              >
                🎬 Ver produção do dia
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => navigate('/funcionario/tarefas')}
              >
                ✓ Atualizar tarefa
              </Button>
              <Button variant="outline" size="md" className="w-full">
                ⚠️ Registrar ocorrência
              </Button>
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <div className="text-center">
              <p className="text-2xl mb-2">📞</p>
              <p className="text-sm font-semibold text-blue-800 mb-1">Precisa de ajuda?</p>
              <p className="text-xs text-blue-600 mb-3">Entre em contato com o gestor ou supervisor</p>
              <button className="text-sm text-blue-700 font-semibold hover:underline">
                Contatar gestor →
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
