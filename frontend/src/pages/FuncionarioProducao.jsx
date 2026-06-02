import { useState, useEffect } from 'react';
import { ChevronDown, Play, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { demandaService } from '../shared/services/demandaService';

export default function FuncionarioProducao() {
  const [demandas, setDemandas] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDemandas();
  }, []);

  const loadDemandas = async () => {
    try {
      setLoading(true);
      const data = await demandaService.listDemandas({ status: 'ATIVA' });
      setDemandas(data || []);
    } catch (err) {
      console.error('Erro ao carregar demandas:', err);
      setDemandas([]);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    EM_PRODUCAO: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-l-blue-500', icon: '👨‍🍳', dot: 'bg-blue-500' },
    PENDENTE: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-l-amber-500', icon: '⏳', dot: 'bg-amber-500' },
    FINALIZADO: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-l-green-500', icon: '✅', dot: 'bg-green-500' },
  };

  const metrics = [
    { label: 'Pendentes', value: demandas.filter((d) => d.status === 'PENDENTE').length, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Em preparo', value: demandas.filter((d) => d.status === 'EM_PRODUCAO').length, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Finalizados', value: demandas.filter((d) => d.status === 'FINALIZADO').length, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  ];

  const handleStatusUpdate = async (demandaId, newStatus) => {
    try {
      if (newStatus === 'FINALIZADO') {
        await demandaService.finalizarDemanda(demandaId);
      }
      loadDemandas();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Produção do Dia</h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('pt-BR')} · {demandas.length} pratos na lista
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className={`border ${metric.border} ${metric.bg} !p-4 text-center`}>
            <p className={`text-2xl font-bold ${metric.color} mb-0.5`}>{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
          </Card>
        ))}
      </div>

      {loading ? (
        <Card><p className="text-center py-10 text-gray-500">Carregando demandas...</p></Card>
      ) : (
        <div className="space-y-3">
          {demandas.map((demanda) => {
            const cfg = statusConfig[demanda.status] || statusConfig.PENDENTE;
            const isExpanded = expandedId === demanda.id;
            return (
              <Card key={demanda.id} className={`!p-0 overflow-hidden border-l-4 ${cfg.border}`}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : demanda.id)}
                  className="w-full text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-base font-bold text-gray-900">{demanda.prato}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span>{cfg.icon}</span>
                          {demanda.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">{demanda.quantidadePrevista} unidades</span>
                        <span className="flex items-center gap-1">⏰ Previsto: {demanda.horarioPrevisto || '--:--'}</span>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 transition-transform flex-shrink-0 mt-0.5 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 sm:p-5 bg-gray-50">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Informações</h4>
                    <p className="text-sm text-gray-700 mb-4">{demanda.observacao || 'Sem observações'}</p>

                    <div className="flex flex-wrap gap-2">
                      {demanda.status === 'PENDENTE' && (
                        <>
                          <Button variant="primary" size="sm" className="flex items-center gap-1.5" onClick={() => handleStatusUpdate(demanda.id, 'EM_PRODUCAO')}>
                            <Play size={14} />
                            Iniciar preparo
                          </Button>
                          <Button variant="outline" size="sm">Ver detalhes</Button>
                        </>
                      )}
                      {demanda.status === 'EM_PRODUCAO' && (
                        <>
                          <Button variant="primary" size="sm" className="flex items-center gap-1.5" onClick={() => handleStatusUpdate(demanda.id, 'FINALIZADO')}>
                            <CheckCircle size={14} />
                            Finalizar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">ℹ️</span>
          <div>
            <h3 className="text-sm font-bold text-blue-900 mb-1">Dica de uso</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              Clique em um prato para expandir e ver detalhes. Use os botões para atualizar o status da produção.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
