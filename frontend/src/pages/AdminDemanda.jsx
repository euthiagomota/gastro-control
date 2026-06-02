import { useState, useEffect } from 'react';
import { Plus, Download, Send } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';
import { demandaService } from '../shared/services/demandaService';

export default function AdminDemanda() {
  const [selectedDay, setSelectedDay] = useState('Ter 06');
  const [demandas, setDemandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const week = [
    { label: 'Seg', date: '05' },
    { label: 'Ter', date: '06' },
    { label: 'Qua', date: '07' },
    { label: 'Qui', date: '08' },
    { label: 'Sex', date: '09' },
    { label: 'Sáb', date: '10' },
    { label: 'Dom', date: '11' },
  ];

  useEffect(() => {
    loadDemandas();
  }, []);

  const loadDemandas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await demandaService.listDemandas();
      setDemandas(data || []);
    } catch (err) {
      console.error('Erro ao carregar demandas:', err);
      setError('Erro ao carregar demandas. Tente novamente.');
      setDemandas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessarDemanda = async (demandaId) => {
    try {
      setProcessingId(demandaId);
      await demandaService.processarDemanda(demandaId);
      await loadDemandas();
    } catch (err) {
      console.error('Erro ao processar demanda:', err);
      setError('Erro ao processar demanda. Tente novamente.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleFinalizarDemanda = async (demandaId) => {
    try {
      setProcessingId(demandaId);
      await demandaService.finalizarDemanda(demandaId);
      await loadDemandas();
    } catch (err) {
      console.error('Erro ao finalizar demanda:', err);
      setError('Erro ao finalizar demanda. Tente novamente.');
    } finally {
      setProcessingId(null);
    }
  };

  const demandaData = demandas.map((demanda) => ({
    id: demanda.id,
    prato: demanda.prato || 'N/A',
    prevista: demanda.quantidadePrevista || 0,
    real: demanda.quantidadeReal || 0,
    diferenca: (demanda.quantidadeReal || 0) - (demanda.quantidadePrevista || 0),
    status: demanda.status || 'Pendente',
  }));

  const columns = [
    { key: 'prato', label: 'Prato' },
    {
      key: 'prevista',
      label: 'Prevista',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'real',
      label: 'Real',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'diferenca',
      label: 'Diferença',
      render: (value) => (
        <span className={`font-bold ${value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {value > 0 ? '+' : ''}{value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
          value === 'Finalizado' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Ações',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.status !== 'Finalizado' && (
            <>
              <Button 
                variant="outline" 
                size="xs"
                onClick={() => handleProcessarDemanda(row.id)}
                disabled={processingId === row.id}
              >
                {processingId === row.id ? 'Processando...' : 'Processar'}
              </Button>
              <Button 
                variant="primary" 
                size="xs"
                onClick={() => handleFinalizarDemanda(row.id)}
                disabled={processingId === row.id}
              >
                {processingId === row.id ? 'Finalizando...' : 'Finalizar'}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const insights = [
    {
      label: 'Total de demandas',
      value: demandas.length,
      detail: 'Demandas cadastradas',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      color: 'text-blue-700',
      icon: '📊',
    },
    {
      label: 'Itens acima da meta',
      value: demandas.filter((d) => (d.quantidadeReal || 0) > (d.quantidadePrevista || 0)).length,
      detail: 'Superaram previsão',
      bg: 'bg-green-50',
      border: 'border-green-200',
      color: 'text-green-700',
      icon: '✅',
    },
    {
      label: 'Itens abaixo da meta',
      value: demandas.filter((d) => (d.quantidadeReal || 0) < (d.quantidadePrevista || 0)).length,
      detail: 'Ficaram aquém',
      bg: 'bg-red-50',
      border: 'border-red-200',
      color: 'text-red-700',
      icon: '⚠️',
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Demanda</h1>
          <p className="text-sm text-gray-500 mt-1">Previsão e acompanhamento de vendas</p>
        </div>
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
          <Button variant="primary" size="sm" onClick={loadDemandas} className="mt-3">
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Demanda</h1>
          <p className="text-sm text-gray-500 mt-1">Previsão e acompanhamento de vendas</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Download size={15} />
            Importar histórico
          </Button>
          <Button variant="primary" size="sm" className="flex items-center gap-1.5">
            <Plus size={15} />
            Adicionar demanda
          </Button>
        </div>
      </div>

      <Card className="!p-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">Semana — 05 a 11 de maio de 2026</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {week.map((day) => {
            const key = `${day.label} ${day.date}`;
            const active = selectedDay === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDay(key)}
                className={`flex flex-col items-center px-3 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap flex-shrink-0 min-w-[52px] ${
                  active ? 'bg-primary-700 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs">{day.label}</span>
                <span className="text-base font-bold">{day.date}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base font-bold text-gray-900">
            Demanda — {selectedDay} de maio
          </h2>
          {loading ? (
            <p className="text-sm text-gray-500">Carregando...</p>
          ) : (
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 self-start sm:self-auto">
              <span>📊</span>
              Gerar cálculo de produção
            </Button>
          )}
        </div>
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Carregando demandas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table columns={columns} data={demandaData} />
          </div>
        )}
      </Card>

      <div className="grid sm:grid-cols-3 gap-4">
        {insights.map((item, i) => (
          <Card key={i} className={`border ${item.border} ${item.bg} !p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{item.icon}</span>
              <p className="text-xs font-semibold text-gray-500">{item.label}</p>
            </div>
            <div className={`text-2xl font-bold ${item.color} mb-0.5`}>{item.value}</div>
            <p className="text-xs text-gray-500">{item.detail}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Download size={15} />
          Exportar para Excel
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Send size={15} />
          Enviar para equipe
        </Button>
      </div>
    </div>
  );
}
