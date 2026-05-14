import { useState } from 'react';
import { Plus, Download, Send } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';

export default function AdminDemanda() {
  const [selectedDay, setSelectedDay] = useState('Ter 06');

  const week = [
    { label: 'Seg', date: '05' },
    { label: 'Ter', date: '06' },
    { label: 'Qua', date: '07' },
    { label: 'Qui', date: '08' },
    { label: 'Sex', date: '09' },
    { label: 'Sáb', date: '10' },
    { label: 'Dom', date: '11' },
  ];

  const demandaData = [
    { id: 1, prato: 'Marmita Fitness', prevista: 42, real: 38, diferenca: -4, status: 'Normal' },
    { id: 2, prato: 'Smash Burguer', prevista: 28, real: 31, diferenca: 3, status: 'Acima da meta' },
    { id: 3, prato: 'Frango Caipira', prevista: 15, real: 14, diferenca: -1, status: 'Normal' },
    { id: 4, prato: 'Massa Caseira', prevista: 20, real: 18, diferenca: -2, status: 'Normal' },
    { id: 5, prato: 'Açaí Gourmet', prevista: 35, real: 42, diferenca: 7, status: 'Acima da meta' },
  ];

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
          value === 'Acima da meta' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  const insights = [
    { label: 'Itens acima da meta', value: 2, detail: 'Açaí e Smash Burguer', bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-700', icon: '✅' },
    { label: 'Itens normais', value: 3, detail: 'Dentro do previsto', bg: 'bg-gray-50', border: 'border-gray-200', color: 'text-gray-700', icon: '📊' },
    { label: 'Ajustes recomendados', value: 2, detail: 'Marmita e Massa', bg: 'bg-red-50', border: 'border-red-200', color: 'text-red-700', icon: '⚠️' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Week Selector */}
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

      {/* Table */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base font-bold text-gray-900">
            Demanda — {selectedDay} de maio
          </h2>
          <Button variant="primary" size="sm" className="flex items-center gap-1.5 self-start sm:self-auto">
            <span>📊</span>
            Gerar cálculo de produção
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table columns={columns} data={demandaData} />
        </div>
      </Card>

      {/* Insights */}
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

      {/* Actions */}
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
